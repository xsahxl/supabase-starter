import { useEffect, useRef, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

const BUCKET_NAME = 'shltest'
const DIRECTORY = 'images'

type FileItem = {
  name: string
  url: string
}

const Storage = () => {
  const supabase = useSupabaseClient()
  const [fileList, setFileList] = useState<FileItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 获取图片列表
  const fetchFileList = async () => {
    setError('')
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(DIRECTORY, { limit: 100, offset: 0 })
    if (error) {
      setError('获取图片列表失败: ' + error.message)
      setFileList([])
      return
    }
    if (!data) {
      setFileList([])
      return
    }
    // 获取每个文件的 public url
    const files = await Promise.all(
      data
        .filter((item) => item.name)
        .map(async (item) => {
          const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(DIRECTORY + '/' + item.name)
          return { name: item.name, url: urlData.publicUrl }
        })
    )
    setFileList(files)
  }

  useEffect(() => {
    fetchFileList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 选择文件
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    } else {
      setSelectedFile(null)
    }
  }

  // 上传图片
  const handleUpload = async () => {
    setError('')
    if (!selectedFile) {
      setError('请先选择图片')
      return
    }
    setUploading(true)
    const fileExt = selectedFile.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(DIRECTORY + '/' + fileName, selectedFile)
    setUploading(false)
    if (uploadError) {
      setError('上传失败: ' + uploadError.message)
      return
    }
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    fetchFileList()
  }

  // 下载图片
  const handleDownload = async (file: FileItem) => {
    setError('')
    const { data, error } = await supabase.storage.from(BUCKET_NAME).download(DIRECTORY + '/' + file.name)
    if (error || !data) {
      setError('下载失败: ' + (error?.message || '未知错误'))
      return
    }
    const url = URL.createObjectURL(data)
    const link = document.createElement('a')
    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // 删除图片
  const handleDelete = async (file: FileItem) => {
    setError('')
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([DIRECTORY + '/' + file.name])
    if (error) {
      setError('删除失败: ' + error.message)
      return
    }
    fetchFileList()
  }

  console.log(fileList, 'fileList')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <div className="w-full max-w-xl bg-white rounded shadow p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">图片存储（Supabase Storage）</h1>
        <div className="w-full flex flex-col sm:flex-row items-center gap-4 mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="block w-full sm:w-auto border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="选择图片"
            tabIndex={0}
            onChange={handleFileChange}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            aria-label="上传图片"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleUpload() }}
          >
            {uploading ? '上传中...' : '上传'}
          </button>
        </div>
        {error && <div className="text-red-500 mb-4 w-full text-center">{error}</div>}
        <div className="w-full">
          <h2 className="text-lg font-semibold mb-2">图片列表</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {fileList.length === 0 && <div className="col-span-2 sm:col-span-3 text-gray-400">暂无图片</div>}
            {fileList.map((file) => (
              <div key={file.name} className="flex flex-col items-center border rounded p-2 bg-gray-100">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-32 h-32 object-cover rounded mb-2 border"
                  tabIndex={0}
                  aria-label={`图片 ${file.name}`}
                />
                <div className="text-xs truncate w-32 mb-1" title={file.name}>{file.name}</div>
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 text-xs"
                  onClick={() => handleDownload(file)}
                  aria-label={`下载图片 ${file.name}`}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleDownload(file) }}
                >
                  下载
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 text-xs mt-1"
                  onClick={() => handleDelete(file)}
                  aria-label={`删除图片 ${file.name}`}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleDelete(file) }}
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Storage
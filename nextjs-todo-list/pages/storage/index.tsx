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
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center py-12 px-8">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold tracking-wide text-neutral-800 mb-2">图片存储（Supabase Storage）</h1>
        <div className="text-neutral-500 mb-8">支持图片上传、下载与删除，安全高效</div>
        <div className="w-full flex flex-col sm:flex-row items-center gap-6 mb-8">
          <label className="flex-1 w-full cursor-pointer border-2 border-dashed border-neutral-300 rounded-lg px-4 py-6 flex flex-col items-center justify-center hover:border-blue-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              aria-label="选择图片"
              tabIndex={0}
              onChange={handleFileChange}
            />
            <svg className="w-10 h-10 text-blue-500 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 16.5V19a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 19v-2.5" /></svg>
            <span className="text-neutral-600">点击或拖拽图片到此处上传</span>
            {selectedFile && <span className="mt-2 text-blue-600 text-sm">已选择: {selectedFile.name}</span>}
          </label>
          <button
            className="bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 transition-colors flex items-center gap-2"
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            aria-label="上传图片"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleUpload() }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
            {uploading ? '上传中...' : '上传'}
          </button>
        </div>
        {error && <div className="bg-red-50 text-red-600 rounded py-2 px-4 mb-4 w-full text-center text-base font-medium shadow-sm">{error}</div>}
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4 text-neutral-700">图片列表</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {fileList.length === 0 && <div className="col-span-2 md:col-span-3 lg:col-span-4 text-neutral-400 text-center">暂无图片</div>}
            {fileList.map((file) => (
              <div key={file.name} className="flex flex-col items-center border border-neutral-200 rounded-xl p-3 bg-neutral-50 shadow-md transition-transform hover:scale-105">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-36 h-36 object-cover rounded-lg mb-2 border border-neutral-200 shadow-sm"
                  tabIndex={0}
                  aria-label={`图片 ${file.name}`}
                />
                <div className="text-xs truncate w-36 mb-2 text-neutral-700" title={file.name}>{file.name}</div>
                <div className="flex gap-2">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-xs transition-colors"
                    onClick={() => handleDownload(file)}
                    aria-label={`下载图片 ${file.name}`}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleDownload(file) }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-red-400 text-xs transition-colors"
                    onClick={() => handleDelete(file)}
                    aria-label={`删除图片 ${file.name}`}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleDelete(file) }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Storage
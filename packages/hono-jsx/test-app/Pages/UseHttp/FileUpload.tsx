import { useHttp } from '@inertiajs/hono-jsx'
import { useState } from 'hono/jsx'

interface UploadResponse {
  success: boolean
  files: Array<{
    fieldname: string
    originalname: string
    mimetype: string
    size: number
  }>
  fileCount: number
  formData: Record<string, string>
}

export default () => {
  const fileUpload = useHttp<{ description: string; file?: File; files?: File[] }, UploadResponse>({
    description: '',
    file: undefined,
    files: undefined,
  })

  const [lastUploadResponse, setLastUploadResponse] = useState<UploadResponse | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  const handleFileChange = (e: Event) => {
    if ((e.target as HTMLInputElement).files && (e.target as HTMLInputElement).files![0]) {
      fileUpload.setData('file', (e.target as HTMLInputElement).files![0])
    }
  }

  const handleMultipleFilesChange = (e: Event) => {
    if ((e.target as HTMLInputElement).files) {
      fileUpload.setData('files', Array.from((e.target as HTMLInputElement).files!))
    }
  }

  const performUpload = async () => {
    setUploadProgress(null)
    try {
      const result = await fileUpload.post('/api/upload', {
        onProgress: (progress) => {
          setUploadProgress(progress.percentage ?? null)
        },
      })
      setLastUploadResponse(result)
    } catch (e) {
      console.error('Upload failed:', e)
    }
  }

  return (
    <div>
      <h1>useHttp File Upload Test</h1>

      {/* File Upload Test */}
      <section id="upload-test">
        <h2>File Upload</h2>
        <label>
          Description
          <input
            type="text"
            id="upload-description"
            value={fileUpload.data.description}
            onChange={(e) => fileUpload.setData('description', (e.target as HTMLInputElement).value)}
          />
        </label>
        <label>
          Single File
          <input type="file" id="upload-file" onChange={handleFileChange} />
        </label>
        <label>
          Multiple Files
          <input type="file" id="upload-files" multiple onChange={handleMultipleFilesChange} />
        </label>
        <button onClick={performUpload} id="upload-button">
          Upload
        </button>
        {fileUpload.processing && <div id="upload-processing">Uploading...</div>}
        {uploadProgress !== null && <div id="upload-progress">Progress: {uploadProgress}%</div>}
        {lastUploadResponse && (
          <div id="upload-result">
            Upload Success - Files: {lastUploadResponse.fileCount}
            {lastUploadResponse.files.length > 0 && (
              <span> - {lastUploadResponse.files.map((f) => f.originalname).join(', ')}</span>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

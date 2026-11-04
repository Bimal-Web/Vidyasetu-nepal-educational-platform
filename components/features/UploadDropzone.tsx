'use client'

import { useState, useRef } from 'react'
import { Upload, X, FileText, Image as ImageIcon, File } from 'lucide-react'
import { cn, formatFileSize } from '@/lib/utils'

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  maxSizeMB?: number
  multiple?: boolean
  uploading?: boolean
  progress?: number
}

export function UploadDropzone({
  onFilesSelected,
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  maxSizeMB = 50,
  multiple = false,
  uploading = false,
  progress = 0,
}: UploadDropzoneProps) {
  const [dragging, setDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validate = (files: File[]): File[] => {
    const maxBytes = maxSizeMB * 1024 * 1024
    const valid = files.filter(f => {
      if (f.size > maxBytes) {
        setError(`"${f.name}" exceeds ${maxSizeMB}MB limit.`)
        return false
      }
      return true
    })
    return valid
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    setError(null)
    const arr = Array.from(files)
    const valid = validate(arr)
    if (valid.length) {
      setSelectedFiles(multiple ? prev => [...prev, ...valid] : valid)
      onFilesSelected(multiple ? valid : [valid[0]])
    }
  }

  const removeFile = (idx: number) => {
    setSelectedFiles(prev => {
      const next = prev.filter((_, i) => i !== idx)
      onFilesSelected(next)
      return next
    })
  }

  const getIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon size={18} className="text-blue-500" />
    if (file.type === 'application/pdf') return <FileText size={18} className="text-red-500" />
    return <File size={18} className="text-slate-500" />
  }

  return (
    <div className="space-y-3">
      <div
        className={cn('dropzone', dragging && 'dragging')}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        id="upload-dropzone"
      >
        <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mx-auto mb-3">
          <Upload size={24} className="text-indigo-700 dark:text-indigo-300" />
        </div>
        <p className="text-slate-600 dark:text-slate-300 font-medium text-sm">
          Drag and drop your study resources here
        </p>
        <p className="text-caption text-slate-400 mt-1">PDF, Word, or Scanned images (Max {maxSizeMB}MB)</p>
        <button
          type="button"
          className="mt-4 btn-secondary text-sm px-4 py-2"
          onClick={e => { e.stopPropagation(); inputRef.current?.click() }}
          id="upload-browse-btn"
        >
          Browse Files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
          id="upload-file-input"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              {getIcon(file)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{file.name}</p>
                <p className="text-caption text-slate-400">{formatFileSize(file.size)}</p>
              </div>
              {!uploading && (
                <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">Uploading...</span>
            <span className="font-medium text-indigo-700">{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}

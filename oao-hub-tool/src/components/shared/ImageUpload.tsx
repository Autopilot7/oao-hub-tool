import { useState } from 'react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
  label?: string
}

export function ImageUpload({ value, onChange, disabled, label }: ImageUploadProps) {
  const [status, setStatus] = useState<'idle' | 'ready' | 'error'>('idle')

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setStatus('error')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      onChange(url)
      setStatus('ready')
    }
    reader.onerror = () => setStatus('error')
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-2">
      {label && <span className="form-label">{label}</span>}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const file = e.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed bg-surface-50' : 'cursor-pointer hover:border-primary-400 hover:bg-primary-50'
        } ${status === 'error' ? 'border-red-400' : 'border-surface-300'}`}
      >
        <input
          type="file"
          accept="image/*"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
          className="hidden"
          id={`img-${label?.replace(/\s/g, '-')}`}
        />
        <label
          htmlFor={`img-${label?.replace(/\s/g, '-')}`}
          className={`cursor-pointer ${disabled ? 'pointer-events-none' : ''}`}
        >
          {value ? (
            <div className="space-y-2">
              <img src={value} alt="preview" className="max-h-24 mx-auto rounded object-contain" />
              <div className="flex items-center justify-center gap-2 text-xs">
                {status === 'ready' && (
                  <span className="text-green-600 font-medium">Status: Ready</span>
                )}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      onChange('')
                      setStatus('idle')
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="py-3 text-ink-400 text-xs">
              <svg className="w-8 h-8 mx-auto mb-1 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Click hoặc kéo thả ảnh vào đây</span>
              {status === 'error' && (
                <p className="text-red-500 mt-1">File không hợp lệ</p>
              )}
            </div>
          )}
        </label>
      </div>
    </div>
  )
}

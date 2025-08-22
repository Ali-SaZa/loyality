import React, { useMemo, useRef, useState } from 'react'
import { Progress } from '@nextui-org/progress'
import toast from 'react-hot-toast'

import CloudUploadIcon from '../icons/CloudUploadIcon'
import TrashIcon from '../icons/TrashIcon'
import CloseIcon from '../icons/CloseIcon'
import FileCheckIcon from '../icons/FileCheckIcon'
import CloudDownloadIcon from '../icons/CloudDownloadIcon'

import axiosInstance from '@/config/axios'
import { FILE_SERVER_URL } from '@/config/env'
import Button from '@/components/formElements/Button'
import { handleDownload, truncateText } from '@/helpers'

interface FileItem {
  id: string
  name: string
  size: string
  type?: string
  uploadPercentage: number
  fileId?: string
}

interface UploadFileProps {
  buttonText?: string
  accept?: string[]
  className?: string
  fileUploaded: (fileId: string, mode?: 'save' | 'remove') => void
  fileId?: string
  noInteraction?: boolean
}

const FileUpload = ({
  buttonText = 'آپلود فایل',
  accept = [],
  className = '',
  fileUploaded,
  fileId,
  noInteraction = false,
}: UploadFileProps) => {
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const requestTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const formatFileSize = (bytes: number) => {
    const formatNumber = (number: number) => {
      return parseFloat(number.toFixed(2)).toString()
    }

    if (bytes < 1024) {
      return bytes + ' B'
    } else if (bytes < 1048576) {
      return formatNumber(bytes / 1024) + ' KB '
    } else if (bytes < 1073741824) {
      return formatNumber(bytes / 1048576) + ' MB '
    } else {
      return formatNumber(bytes / 1073741824) + ' GB '
    }
  }

  const findFileFormat = (type: string) => {
    if (type.indexOf('image') > -1) return 'PFT_Image'
    else if (type.indexOf('video') > -1) return 'PFT_Video'
    else if (type.indexOf('audio') > -1) return 'PFT_Audio'
    else if (type.indexOf('pdf') > -1) return 'PFT_Text'
  }

  const hasType = (type: string) => accept.some((item) => item?.toLowerCase()?.includes(type))

  const acceptFile = useMemo(() => {
    if (!accept.length) {
      return '*'
    } else {
      let acceptableFormat = []

      if (hasType('image'))
        acceptableFormat.push('image/*') // Accept all image types
      else if (hasType('audio'))
        acceptableFormat.push('audio/*') // Accept all audio types
      else if (hasType('video'))
        acceptableFormat.push('video/*') // Accept all video types
      else if (hasType('text'))
        acceptableFormat.push(
          '.pdf',
          '.txt',
          '.doc',
          '.pptx',
          '.xlsx',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain', // پوشش تمام فایل‌های متنی ساده
          'text/csv', // فایل‌های CSV
          'text/html', // فایل‌های HTML
          'text/markdown', // فایل‌های Markdown
          'application/msword', // فایل‌های Word قدیمی
          'application/rtf', // فایل‌های RTF
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        )

      return acceptableFormat.join(',')
    }
  }, [accept])

  const hintText = useMemo(() => {
    let text = ''

    if (hasType('image')) text = 'SVG, PNG, JPG, GIF'
    else if (hasType('audio')) text += text.length ? ', MP3, WAV' : 'MP3, WAV'
    else if (hasType('video')) text += text.length ? ', MP4' : 'MP4'
    else if (hasType('text')) text += text.length ? ', PDF, TXT, DOCX, PPTX, XLSX' : 'PDF, TXT, DOCX, PPTX, XLSX'

    return text
  }, [accept])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      const textMimeTypes = [
        'text/plain', // فایل‌های متنی ساده
        'text/csv', // فایل‌های CSV
        'text/html', // فایل‌های HTML
        'text/markdown', // فایل‌های Markdown
        'application/pdf', // فایل‌های PDF
        'application/rtf', // فایل‌های RTF
        'application/msword', // فایل‌های Word قدیمی
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // فایل‌های Word جدید
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ]

      if (textMimeTypes.includes(file.type)) {
        // بررسی می‌کند که آیا acceptFile شامل هر کدام از MIME type های متنی است یا خیر
        if (!textMimeTypes.some((type) => acceptFile.includes(type))) {
          toast.error('فایل انتخاب شده باید یک فایل مورد قبول باشد.')

          return
        }
      } else {
        // برای سایر انواع فایل‌ها، بررسی تطبیق نوع اصلی MIME
        const fileType = file.type.split('/')[0]
        const acceptedType = acceptFile.split('/')[0]

        if (fileType !== acceptedType) {
          toast.error('فایل انتخاب شده باید یک فایل مورد قبول باشد.')

          return
        }
      }

      setSelectedFile(file)
      setFiles((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: file.name,
          size: formatFileSize(file.size),
          type: findFileFormat(file.type),
          uploadPercentage: 0,
        },
      ])

      if (requestTimeoutRef.current) clearTimeout(requestTimeoutRef.current)

      requestTimeoutRef.current = setTimeout(() => {
        handleUpload(file)
      }, 500)
    }
  }

  const handleUpload = (file: File) => {
    const data = new FormData()

    data.append('file', file)

    const controller = new AbortController()

    setAbortController(controller)

    axiosInstance
      .post(FILE_SERVER_URL, data, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const uploadPercentage = Math.round((progressEvent.loaded / progressEvent.total) * 100)

            setFiles((prev) => prev.map((f) => (f.name === file.name ? { ...f, uploadPercentage } : f)))
          }
        },
      })
      .then((result) => {
        if (result.data) {
          const newFile = {
            id: result.data.data.id,
            url: result.data.data.url,
          }

          setFiles((prev) => prev.map((f) => (f.name === file.name ? { ...f, fileId: newFile.id } : f)))
          fileUploaded(newFile.id)
        } else {
          console.error('File upload failed!')
        }
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Upload canceled')
        } else {
          console.error('Upload failed:', error)
        }
      })
  }

  const cancelUpload = () => {
    if (abortController) {
      abortController.abort()
      setFiles((prev) => prev.slice(0, -1))
      setAbortController(null)
    }
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
    fileUploaded(fileId, 'remove')
  }

  return (
    <div className="flex flex-col gap-4">
      {files?.length === 0 && !fileId && (
        <div className={`flex flex-col items-center relative ${className}`}>
          <input
            accept={acceptFile}
            id="file-upload"
            style={{ display: 'none' }}
            type="file"
            onChange={handleFileChange}
          />
          <label
            className="cursor-pointer py-4 px-6 flex flex-col gap-4 items-center border border-background-primary rounded-2xl w-full bg-background-50/30"
            htmlFor="file-upload"
          >
            <div className="mx-auto rounded-full size-[53px] md:size-[100px] flex items-center justify-center bg-background-50">
              <CloudUploadIcon className="size-6 md:size-[38px] text-text-dark" />
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <p className="text-secondary font-bold text-sm md:text-medium">{buttonText}</p>
              <p className="text-text-light text-sm md:text-medium">{hintText}</p>
            </div>
          </label>
        </div>
      )}
      {!!fileId && !files?.length && (
        <div className="p-4 rounded-2xl border border-secondary flex gap-1 justify-between relative">
          <div
            className="flex items-center gap-4 grow ml-6 cursor-pointer"
            role="button"
            onClick={() => handleDownload(fileId, 'فایل دانلود شده')}
          >
            <div className="rounded-full bg-background-primary size-12 flex items-center justify-center">
              <CloudDownloadIcon className="size-6 text-primary" />
            </div>
            <p>دانلود فایل</p>
          </div>
          {!noInteraction && (
            <Button
              iconOnly
              className="rounded-full absolute top-2 left-2 z-50"
              color="default"
              variant="light"
              onClick={() => fileUploaded(fileId, 'remove')}
            >
              <TrashIcon className="size-5 text-text" />
            </Button>
          )}
        </div>
      )}
      {!!files?.length &&
        files.map((file) => (
          <div
            key={file.id}
            className="p-4 rounded-2xl border border-secondary flex gap-1 justify-between relative"
          >
            {file.uploadPercentage === 100 ? (
              <>
                <div
                  className="flex items-center gap-4 grow ml-6 cursor-pointer"
                  role="button"
                  onClick={() => handleDownload(file.fileId!, file.name)}
                >
                  <div className="rounded-full bg-background-primary size-12 flex items-center justify-center">
                    <CloudDownloadIcon className="size-6 text-primary" />
                  </div>
                  <p>دانلود فایل</p>
                </div>
                <Button
                  iconOnly
                  className="rounded-full absolute top-2 left-2 z-50"
                  color="default"
                  variant="light"
                  onClick={() => removeFile(file.id)}
                >
                  <TrashIcon className="size-5 text-text" />
                </Button>
              </>
            ) : (
              <>
                <div className="flex gap-4 grow">
                  <div className="size-10 bg-secondary-5 rounded-full flex items-center justify-center">
                    <FileCheckIcon className="size-5 text-secondary-100" />
                  </div>
                  <div className="flex flex-col gap-1 grow">
                    <div className="flex flex-col">
                      <p className="text-text-dark text-sm md:text-medium">{truncateText(file.name, 30)}</p>
                      <p
                        className="font-light text-end text-sm md:text-medium"
                        dir="ltr"
                      >
                        {file.size}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-text-dark">{file.uploadPercentage}%</p>
                      <Progress
                        aria-label="Loading..."
                        color="secondary"
                        value={file.uploadPercentage}
                      />
                    </div>
                  </div>
                </div>
                <Button
                  iconOnly
                  className="rounded-full"
                  color="default"
                  variant="light"
                  onClick={cancelUpload}
                >
                  <CloseIcon className="size-5 text-text" />
                </Button>
              </>
            )}
          </div>
        ))}
    </div>
  )
}

export default FileUpload

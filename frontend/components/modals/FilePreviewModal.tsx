'use client'

import React, { useEffect, useState } from 'react'
import Modal from '@/components/modals/Modal'
import { getMediaType, handleDownload, fileAddress } from '@/helpers'
import VideoPlayer from '@/components/media/VideoPlayer'
import Alert from '@/components/utils/Alert'

interface FilePreviewModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  fileName: string
  fileId: string
  fileType?: string
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ isOpen, setIsOpen, fileName, fileId, fileType }) => {
  const [mediaType, setMediaType] = useState<string | null>(null)

  useEffect(() => {
    setMediaType(getMediaType(fileId))
  }, [fileId])

  return (
    <Modal
      isOpen={isOpen}
      title="مشاهده فایل آموزشی"
      acceptBtnText="دانلود"
      hideFooter={fileType ? true : false}
      onClose={() => {
        setIsOpen(false)
      }}
      onAccept={() => {
        handleDownload(fileId, fileName, true)
      }}
      onOpenChange={(state) => setIsOpen(state)}
    >
      <div className="text-center">
        <div className="text-center">
          {fileType === 'UFFT_Image' && (
            <img
              alt="source image"
              src={fileAddress(fileId)}
              className="max-w-full max-h-96 mx-auto"
            />
          )}
          {fileType === 'UFFT_Video' && (
            <VideoPlayer
              videoId={fileId}
              isUrl={false}
            />
          )}
          {!fileType && mediaType === 'Image' && (
            <img
              alt="Preview Image"
              src={fileId}
              className="max-w-full max-h-96 mx-auto"
            />
          )}
          {!fileType && mediaType === 'Video' && (
            <VideoPlayer
              videoId={fileId}
              isUrl={true}
            />
          )}
          {!fileType && !mediaType && <Alert title="فایل یافت نشد!" />}
        </div>
      </div>
    </Modal>
  )
}

export default FilePreviewModal

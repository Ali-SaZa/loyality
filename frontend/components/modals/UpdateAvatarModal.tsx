'use client'
import React, { useState } from 'react'
import { useDisclosure } from '@nextui-org/modal'
import toast from 'react-hot-toast'

import FileUpload from '../media/FileUpload'

import Modal from './Modal'

import { UPDATE_USER_AVATAR } from '@/services/user'
import useAuth from '@/hooks/useAuth'
import { fileAddress } from '@/helpers'

interface UpdateAvatarModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const UpdateAvatarModal = ({ isOpen, setIsOpen }: UpdateAvatarModalProps) => {
  const { updateUserFromOutside } = useAuth()
  const { onOpenChange } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const [fileId, setFileId] = useState<string>('')

  const handleFileUploaded = (fileId: string, mode: 'save' | 'remove' = 'save') => {
    if (mode === 'remove') {
      setFileId('')
    } else {
      setFileId(fileId)
    }
  }

  const handleSendAvatarImage = async () => {
    try {
      setIsLoading(true)
      await UPDATE_USER_AVATAR(fileId)
      updateUserFromOutside({ imageId: fileId })
      setFileId('')
      toast.success('عکس پروفایل شما با موفقیت بروزرسانی شد')
      setIsOpen(false)
    } catch (error) {
      console.log('error', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      acceptBtnDisabled={!fileId}
      acceptBtnText="ویرایش"
      headerClassName="border-none font-semibold"
      isLoading={isLoading}
      isOpen={isOpen}
      title="ویرایش آواتار"
      onAccept={handleSendAvatarImage}
      onClose={() => setIsOpen(false)}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col">
        {/* <div className="flex flex-col gap-2 mb-6">
          <p>انتخاب آواتار</p>
          <div className="flex flex-wrap gap-2 items-center border-r-3 border-background-primary pr-4">
            <img
              role="button"
              className="size-20 min-w-20 min-h-20 rounded-full bg-background-50"
              src="/images/placeholders/image.png"
              alt="avatar"
            />
            <img
              role="button"
              className="size-20 min-w-20 min-h-20 rounded-full bg-background-50"
              src="/images/placeholders/image.png"
              alt="avatar"
            />
            <img
              role="button"
              className="size-20 min-w-20 min-h-20 rounded-full bg-background-50"
              src="/images/placeholders/image.png"
              alt="avatar"
            />
            <img
              role="button"
              className="size-20 min-w-20 min-h-20 rounded-full bg-background-50"
              src="/images/placeholders/image.png"
              alt="avatar"
            />
          </div>
        </div> */}
        <div className="flex flex-col gap-2 mb-6">
          <p>انتخاب تصویر</p>
          <div className="flex items-center gap-4 border-r-3 border-background-primary pr-4">
            {!!fileId && (
              <img
                alt="user avatar"
                className="size-20 min-w-20 min-h-20 rounded-full mx-auto "
                src={fileAddress(fileId)}
              />
            )}
            <div className="grow">
              <FileUpload
                accept={['image']}
                buttonText="انتخاب تصویر پروفایل"
                fileUploaded={handleFileUploaded}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default UpdateAvatarModal

'use client'
import React from 'react'
import { useDisclosure } from '@heroui/modal'

import Modal from '@/components/modals/Modal'
import useLoading from '@/hooks/useLoading'
import DotLoadingIcon from '@/components/icons/DotLoadingIcon'
import ObsLogo from '@/components/ui/ObsLogo'

const Loading = () => {
  const { onOpenChange } = useDisclosure()
  const { loading } = useLoading()

  return (
    <Modal
      key={loading ? '1' : '0'}
      hideCloseButton
      hideFooter
      hideHeader
      className="p-4 !w-[300px]"
      isLoading={loading}
      isOpen={loading}
      placement="center"
      onOpenChange={onOpenChange}
    >
      <div className="flex items-center justify-center flex-col gap-4">
        <ObsLogo disableClick />
        <p className="flex gap-1 items-center justify-center">
          در حال بارگزاری اطلاعات <DotLoadingIcon />
        </p>
      </div>
    </Modal>
  )
}

export default Loading

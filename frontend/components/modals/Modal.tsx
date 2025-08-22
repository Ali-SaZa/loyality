import React, { PropsWithChildren } from 'react'
import { Modal as NextUiModal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal'

import Button from '@/components/formElements/Button'

interface ModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onClose?: () => void
  onAccept?: () => void
  onReject?: () => void
  isLoading?: boolean
  title?: string
  acceptBtnText?: string
  rejectBtnText?: string
  acceptBtnDisabled?: boolean
  rejectBtnDisabled?: boolean
  hideCloseButton?: boolean
  hideHeader?: boolean
  hideFooter?: boolean
  className?: string
  bodyClassName?: string
  headerClassName?: string
  footerClassName?: string
  headerChildren?: React.ReactNode
  footerChildren?: React.ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
  radius?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: undefined | 'sm' | 'md' | 'lg'
  placement?: 'auto' | 'top' | 'center' | 'bottom'
  scrollBehavior?: 'normal' | 'inside' | 'outside'
  backdrop?: 'transparent' | 'opaque' | 'blur'
}

const Modal = ({
  isOpen,
  onOpenChange,
  onClose,
  onAccept,
  onReject,
  isLoading = false,
  title = '',
  children,
  acceptBtnText = 'بله',
  rejectBtnText = 'بستن',
  acceptBtnDisabled = false,
  rejectBtnDisabled = false,
  hideCloseButton = false,
  hideHeader = false,
  hideFooter = false,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  footerClassName = '',
  headerChildren,
  footerChildren,
  size = 'md',
  radius = 'lg',
  shadow = 'lg',
  placement = 'auto',
  scrollBehavior = 'inside',
  backdrop = 'opaque',
}: PropsWithChildren<ModalProps>) => {
  return (
    <NextUiModal
      backdrop={backdrop}
      className={`p-6 ${className}`}
      classNames={{
        closeButton: 'absolute !top-4 !left-6',
      }}
      hideCloseButton={hideCloseButton || isLoading}
      isDismissable={!isLoading}
      isOpen={isOpen}
      placement={placement}
      radius={radius}
      scrollBehavior={scrollBehavior}
      shadow={shadow}
      size={size}
      onClose={onClose}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            {!hideHeader && (
              <ModalHeader
                className={`flex items-center p-0 pb-4 text-medium font-normal text-text-dark ${children && 'border-b'} border-background-50 mb-4 ${headerClassName}`}
              >
                {headerChildren}
                {title}
              </ModalHeader>
            )}
            <ModalBody className={`p-0 ${bodyClassName}`}>{children}</ModalBody>
            {!hideFooter && (
              <ModalFooter className={`justify-start p-0 pt-4 ${children && 'border-t'} border-background-50 mt-4 ${footerClassName}`}>
                {footerChildren ? (
                  footerChildren
                ) : (
                  <>
                    <Button
                      className="grow"
                      disabled={acceptBtnDisabled || isLoading}
                      isLoading={isLoading}
                      onClick={onAccept}
                    >
                      {acceptBtnText}
                    </Button>

                    <Button
                      disabled={rejectBtnDisabled || isLoading}
                      isLoading={isLoading}
                      variant="light"
                      onClick={onReject || onClose}
                    >
                      {rejectBtnText}
                    </Button>
                  </>
                )}
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </NextUiModal>
  )
}

export default Modal

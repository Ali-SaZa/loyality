'use client'
import React from 'react'

import Modal from './Modal'

interface ConfirmationModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onConfirm: () => void
  title: string
  message: string
  acceptBtnText?: string
  rejectBtnText?: string
  acceptBtnColor?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  isLoading?: boolean
  icon?: React.ReactNode
  iconBgColor?: string
  iconTextColor?: string
  children?: React.ReactNode
}

const ConfirmationModal = ({ 
  isOpen, 
  onOpenChange, 
  onConfirm, 
  title, 
  message,
  acceptBtnText = 'تأیید',
  rejectBtnText = 'انصراف',
  acceptBtnColor = 'primary',
  isLoading = false,
  icon,
  iconBgColor = 'bg-primary-50',
  iconTextColor = 'text-primary',
  children
}: ConfirmationModalProps) => {
  const handleConfirm = () => {
    onConfirm()
  }

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      onAccept={handleConfirm}
      onReject={handleClose}
      title={title}
      acceptBtnText={acceptBtnText}
      rejectBtnText={rejectBtnText}
      acceptBtnColor={acceptBtnColor}
      size="md"
      isLoading={isLoading}
      acceptBtnDisabled={isLoading}
      rejectBtnDisabled={isLoading}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center`}>
              <div className={`size-6 ${iconTextColor}`}>
                {icon}
              </div>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-text-dark">{title}</h3>
            <p className="text-text-light">{message}</p>
          </div>
        </div>
        
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ConfirmationModal

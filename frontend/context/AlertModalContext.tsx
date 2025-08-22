'use client'
import React, { createContext, useState } from 'react'
import { useDisclosure } from '@heroui/modal'

import Modal from '@/components/modals/Modal'

interface AlertModalContextType {
  showAlert: (message: string, onConfirm?: (data?: any) => void, data?: any) => void
  hideAlert: () => void
}

export const AlertModalContext = createContext<AlertModalContextType | undefined>(undefined)

export const AlertModalProvider = ({ children }: { children: React.ReactNode }) => {
  const { onOpenChange } = useDisclosure()
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [onConfirm, setOnConfirm] = useState<((data?: any) => void) | undefined>(undefined)
  const [confirmData, setConfirmData] = useState<any>(undefined)

  const showAlert = (msg: string, confirmCallback?: (data?: any) => void, data?: any) => {
    setMessage(msg)
    setOnConfirm(() => confirmCallback)
    setConfirmData(data)
    setIsVisible(true)
  }

  const hideAlert = () => {
    setIsVisible(false)
    setMessage('')
    setOnConfirm(undefined)
    setConfirmData(undefined)
  }

  return (
    <AlertModalContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <Modal
        hideCloseButton
        hideHeader
        bodyClassName="text-center font-semibold text-text-dark"
        isOpen={isVisible}
        onAccept={() => {
          if (onConfirm) onConfirm(confirmData)
          hideAlert()
        }}
        onClose={hideAlert}
        onOpenChange={onOpenChange}
      >
        {message}
      </Modal>
    </AlertModalContext.Provider>
  )
}

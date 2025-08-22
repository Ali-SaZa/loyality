import { useContext } from 'react'

import { AlertModalContext } from '@/context/AlertModalContext'

const useAlertModal = () => {
  const context = useContext(AlertModalContext)

  if (!context) {
    throw new Error('useAlertModal باید درون AlertModalProvider استفاده شود')
  }

  return context
}

export default useAlertModal

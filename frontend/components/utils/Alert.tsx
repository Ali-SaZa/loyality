import React from 'react'
import { Alert as NextUiAlert } from '@nextui-org/alert'

interface AlertProps {
  title: string
  description?: string
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  variant?: 'solid' | 'bordered' | 'flat' | 'faded'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  isClosable?: boolean
  hideIcon?: boolean
  hideIconWrapper?: boolean
}

const Alert = ({ title, description, color, variant = 'faded', radius, isClosable, hideIcon, hideIconWrapper = true }: AlertProps) => {
  return (
    <NextUiAlert
      color={color}
      description={description}
      hideIcon={hideIcon}
      hideIconWrapper={hideIconWrapper}
      isClosable={isClosable}
      radius={radius}
      title={title}
      variant={variant}
    />
  )
}

export default Alert

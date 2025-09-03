'use client'
import { User } from '@heroui/user'
import React from 'react'

interface StyledUserProps {
  name?: string
  description?: string
  avatarSrc?: string
  isOnDarkBackground?: boolean
  className?: string
}

const StyledUser = ({ 
  name, 
  description, 
  avatarSrc = '/images/man-placeholder.webp',
  isOnDarkBackground = false,
  className = ''
}: StyledUserProps) => {
  const baseClasses = '[&_span.bg-default]:!bg-transparent'
  const darkBackgroundClasses = isOnDarkBackground 
    ? 'text-white [&_div]:text-white [&_p]:text-white [&_span]:text-white [&_.text-foreground]:text-white [&_.text-default-500]:text-white/80 [&_.text-default-400]:text-white/60'
    : ''

  return (
    <User
      avatarProps={{
        src: avatarSrc
      }}
      className={`${baseClasses} ${darkBackgroundClasses} ${className}`}
      description={description}
      name={name}
    />
  )
}

export default StyledUser

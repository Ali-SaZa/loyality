'use client'
import React from 'react'

import useWindowSize from '@/hooks/useWindowSize'

const IntroHeader = ({
  url,
  className = '',
  customGradient = 'bg-[linear-gradient(180deg,rgba(255,255,255,0.5)0%,rgba(58,77,154,0.8)100%),linear-gradient(0deg,rgba(255,255,255,0.2),rgba(255,255,255,0.2))]',
  disableGradient = false,
  children,
  mobileHeight = 500,
  desktopHeight = 436,
}: {
  url: string
  className?: string
  customGradient?: string
  disableGradient?: boolean
  children: React.ReactNode
  mobileHeight?: number
  desktopHeight?: number
}) => {
  const { width } = useWindowSize()

  return (
    <header className="relative">
      <img
        alt="interest header"
        className={`w-full object-cover`}
        height={width < 768 ? mobileHeight : desktopHeight}
        src={url}
        style={{ height: width < 768 ? mobileHeight : desktopHeight + 'px' }}
        width={width}
      />
      {!disableGradient && (
        <div
          className={`w-full absolute top-0 right-0 z-10 ${customGradient}`}
          style={{ height: width < 768 ? mobileHeight : desktopHeight + 'px' }}
        />
      )}
      <div className="w-full absolute bottom-[10%] right-0 z-20">
        <div className={`container mx-auto text-center ${className}`}>{children}</div>
      </div>
    </header>
  )
}

export default IntroHeader

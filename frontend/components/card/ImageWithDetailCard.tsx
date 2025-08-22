import React from 'react'

interface ImageWithDetailCardProps {
  url: string
  title: string
  description: string
  className?: string
  imageClassName?: string
  titleClassName?: string
}

const ImageWithDetailCard = ({
  url,
  title,
  description,
  className = '',
  imageClassName = '',
  titleClassName = '',
}: ImageWithDetailCardProps) => {
  return (
    <div className={`flex flex-col gap-4 text-center ${className}`}>
      <div className={`mx-auto ${imageClassName}`}>
        <img
          alt="vector with detail"
          className={`mx-auto ${imageClassName}`}
          src={url}
        />
      </div>
      <p className={`text-text-dark text-lg font-bold leading-7 ${titleClassName}`}>{title}</p>
      <p>{description}</p>
    </div>
  )
}

export default ImageWithDetailCard

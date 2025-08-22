import React, { useState } from 'react'

interface MemberCardProps {
  imageUrl: string
  name: string
  label: string
  className?: string
  alt?: string
}

const MemberCard: React.FC<MemberCardProps> = ({ imageUrl, name, label, className, alt = 'Image' }) => {
  const [isActive, setIsActive] = useState(false)

  return (
    <div
      className="md:max-w-80 h-[480px] md:h-[380px] overflow-hidden relative"
      role="button"
      onClick={() => setIsActive(!isActive)}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <img
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        src={imageUrl}
      />
      <div
        className={`flex items-end justify-center pb-16 absolute inset-0 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'linear-gradient(180deg, rgba(99, 99, 99, 0.4) 0%, #000000 100%)',
        }}
      >
        <div className="text-center">
          <p className="text-xl font-bold text-white mb-1">{name}</p>
          <p className="text-md text-secondary">{label}</p>
        </div>
      </div>
    </div>
  )
}

export default MemberCard

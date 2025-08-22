import React from 'react'

import Button from '@/components/formElements/Button'
import CheckIcon from '@/components/icons/CheckIcon'

interface AchievementCardProps {
  title: string
  description: string
  imageUrl: string
  buttonText: string
  buttonColor?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  onClick?: () => void
  disabled?: boolean
}

const AchievementCard = ({
  title,
  description,
  imageUrl,
  buttonText,
  buttonColor = 'primary',
  onClick,
  disabled = false,
}: AchievementCardProps) => {
  return (
    <div className="rounded-xl bg-background-20 px-5 py-6 flex flex-col items-center gap-4">
      <div className="size-[150px]">
        <img
          alt="achievement"
          height={150}
          src={imageUrl}
          width={198}
        />
      </div>
      <div className="flex flex-col gap-3 items-center grow">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded-full bg-success flex items-center justify-center">
            <CheckIcon className="size-3 text-white" />
          </div>
          <p className="font-semibold leading-6 text-text-dark">{title}</p>
        </div>
        <p className="text-sm text-center">{description}</p>
      </div>
      <Button
        fullWidth
        className={`text-${buttonColor}`}
        color={buttonColor}
        disabled={disabled}
        variant="flat"
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </div>
  )
}

export default AchievementCard

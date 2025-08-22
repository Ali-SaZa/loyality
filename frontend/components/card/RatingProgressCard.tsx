import React from 'react'
import { Progress } from '@heroui/progress'

interface RatingProgressCardProps {
  title: string
  score: number
  total?: number
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  titleClassName?: string
  scoreClassName?: string
}

const RatingProgressCard = ({
  title,
  score,
  total = 100,
  color = 'primary',
  size = 'md',
  className = '',
  titleClassName = '',
  scoreClassName = '',
}: RatingProgressCardProps) => {
  return (
    <div className={`rounded-xl flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <p className={`font-bold ${titleClassName}`}>{title}</p>
        <div className={`flex items-center gap-1 mr-2 text-sm leading-5 ${scoreClassName}`}>
          <p className="text-text-dark">{score} امتیاز</p>
          <p className="text-text-light-25">از {total}</p>
        </div>
      </div>
      <Progress
        aria-label="Loading..."
        className="rotate-180 !h-2"
        color={color}
        size={size}
        value={score}
      />
    </div>
  )
}

export default RatingProgressCard

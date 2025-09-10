'use client'
import React from 'react'

interface SmsBalanceDisplayProps {
  balance: number
  className?: string
}

const SmsBalanceDisplay = ({ balance, className = '' }: SmsBalanceDisplayProps) => {
  return (
    <div className={`flex items-center bg-gray-100 rounded-lg px-3 py-2 ${className}`}>    
      <span className="text-gray-700 text-sm mx-1">
        موجودی پیامک:
      </span>


      <span className="text-gray-700 font-medium text-sm">
        {balance.toLocaleString('fa-IR')}
      </span>
    </div>
  )
}

export default SmsBalanceDisplay

'use client'
import React from 'react'

interface SmsBalanceDisplayProps {
  balance: number
  className?: string
}

const SmsBalanceDisplay = ({ balance, className = '' }: SmsBalanceDisplayProps) => {
  return (
    <div className={`flex items-center bg-gray-100 rounded-lg px-3 py-2 ${className}`}>
      {/* Green bar on the left */}
      <div className="w-1 h-8 bg-green-500 rounded-full mr-3"></div>
      
      {/* SMS count */}
      <span className="text-gray-700 font-medium text-sm">
        {balance.toLocaleString('fa-IR')}
      </span>
      
      {/* SMS label */}
      <span className="text-gray-700 text-sm mr-1">
        پیامک
      </span>
      
      {/* SMS icon */}
      <div className="w-5 h-5 text-gray-700">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="w-full h-full"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          <path d="M13 8H7"/>
          <path d="M17 12H7"/>
        </svg>
      </div>
    </div>
  )
}

export default SmsBalanceDisplay

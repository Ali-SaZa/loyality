import React from 'react'

interface BlueGradientAlertProps {
  text: string
}

const BlueGradientAlert = ({ text }: BlueGradientAlertProps) => {
  return (
    <div className="w-full rounded-xl py-4 px-5 flex items-center gap-6 bg-custom-blue-gradient">
      <div className="max-w-[130px] hidden md:block">
        <img
          alt="payment"
          src="/images/payment.png"
        />
      </div>
      <p className="text-white font-bold">{text}</p>
    </div>
  )
}

export default BlueGradientAlert

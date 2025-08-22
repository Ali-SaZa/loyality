import React from 'react'

const ServicesCard = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
  return (
    <div className="border rounded-[10px] py-12 px-6 flex flex-col gap-4 items-center justify-start text-white w-[200px] h-full">
      <div className="drop-shadow-[0_4px_20px_rgba(255,255,255,0.46)]">{icon}</div>
      <p className="font-bold text-center text-3xl drop-shadow-[0_0_20px_rgba(255,255,255,0.46)]">{text}</p>
    </div>
  )
}

export default ServicesCard

import React from 'react'

const TitleWithDivider = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="w-full h-[1px] bg-background-70 " />
      <p className="text-text-dark text-nowrap">{title}</p>
      <div className="w-full h-[1px] bg-background-70 " />
    </div>
  )
}

export default TitleWithDivider

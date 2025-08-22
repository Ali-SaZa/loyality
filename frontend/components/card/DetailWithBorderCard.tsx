import React from 'react'

const DetailWithBorderCard = ({ details }: { details: PaymentDetailType[] }) => {
  return (
    <div className="w-full bg-background-10 rounded-xl py-10 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-9 gap-x-10 md:gap-x-[128px]">
        {details.map((detail, index) => (
          <div
            key={index}
            className="flex items-center gap-3"
          >
            <p className="text-text-light-25 text-sm">{detail.title}</p>
            <div className="grow border border-dashed border-text-light" />
            <p className="text-text-dark font-bold text-sm md:text-medium">{detail.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DetailWithBorderCard

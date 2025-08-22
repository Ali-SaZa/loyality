import React from 'react'

const CourseCard = () => {
  return (
    <div className="p-3 flex flex-col gap-[5px] rounded-xl bg-white cursor-pointer ">
      <img
        alt="card"
        className="rounded-lg"
        height={98}
        src="/images/simulator.jpg"
        width={155}
      />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-text-dark font-semibold">دوره حسابداری</p>
          <p className="text-sm text-primary">800,000</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-6 rounded-full flex items-center justify-center">
            <img
              alt="brand"
              height={16.8}
              src="/images/nahal.png"
              width={14.4}
            />
          </div>
          <p className="font-bold text-text-light-25 text-sm leading-6">شرکت نهال</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="size-[6px] bg-secondary rounded-full" />
            <p className="text-text-light-25 text-sm">+500 هنرجو</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="size-[6px] bg-secondary rounded-full" />
            <p className="text-text-light-25 text-sm">۲۸ ساعت</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard

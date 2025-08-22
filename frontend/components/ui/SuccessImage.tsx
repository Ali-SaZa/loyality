import React from 'react'

const SuccessImage = () => {
  return (
    <div className="flex flex-col gap-5 items-center">
      <div className="max-w-[320px]">
        <img
          alt="success"
          src="/images/success.png"
        />
      </div>
      <div className="flex flex-col items-center gap-4">
        <p className="text-text-dark text-lg font-bold">ماموریت تکمیل شد!</p>
        <div className="flex flex-col item-center text-center">
          <p className="text-text-light-25">تبریک!</p>
          <p className="text-text-light-25">همه کار های این ماموریت عالی تکمیل شدن.</p>
        </div>
      </div>
    </div>
  )
}

export default SuccessImage

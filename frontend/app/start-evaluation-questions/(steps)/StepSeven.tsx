import React from 'react'

const StepSeven = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center gap-5 md:gap-16">
      <div className="flex-1 flex flex-col gap-10">
        <p className="text-text-dark text-[24px] md:text-[32px] text-center md:text-start">این تجربه شما را برای موفقیت آماده میکنه</p>
        <div className="flex flex-col gap-1 text-medium md:text-lg text-center md:text-start">
          <p>اون رو توی رزومه‌ی خودتون قرار بدید.</p>
          <p>تجربه‌ای که برای درخواست کار نیاز دارید رو کسب کنید.</p>
          <p>در موردش در رویدادهای شبکه‌سازی و مصاحبه‌ها صحبت کنید.</p>
        </div>
      </div>
      <div className="flex-1 max-w-[400px]">
        <img
          alt="start evaluation questions 1"
          src="/images/seqs7.webp"
        />
      </div>
    </div>
  )
}

export default StepSeven

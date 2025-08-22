import React from 'react'
import { RadioGroup } from '@nextui-org/radio'

import Radio from '@/components/formElements/Radio'

interface StepOneProps {
  value: string
  onValueChange: (value: string) => void
}

const StepOne = ({ value, onValueChange }: StepOneProps) => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center gap-5 md:gap-16">
      <div className="flex-1 flex flex-col gap-10">
        <p className="text-text-dark text-[24px] md:text-[32px] text-center md:text-start">الان دقیقا توی چه وضعیتی هستی؟</p>
        <RadioGroup
          className="w-full"
          value={value}
          onValueChange={onValueChange}
        >
          <Radio
            className={'!py-4 !px-5'}
            value="UJSES_Student"
          >
            <div className="flex items-center gap-4">
              <div className="max-w-12">
                <img
                  alt="radio"
                  src="/images/seqs1-radio2.webp"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-text-dark">دانش آموزم و منتظر کنکور</p>
                <p className="text-text-light-25 text-sm">درسم تموم شده ولی هنوز دانشگاه نرفتم</p>
              </div>
            </div>
          </Radio>
          <Radio
            className={'!py-4 !px-5'}
            value="UJSES_Collegian"
          >
            <div className="flex items-center gap-4">
              <div className="max-w-12">
                <img
                  alt="radio"
                  src="/images/seqs1-radio1.webp"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-text-dark">دانشجوام و میخوام واسه آینده م انتخاب درستی داشته باشم</p>
                <p className="text-text-light-25 text-sm">دوره دانشجوییم تموم شده اما هنوز شغلی که مناسبم باشه پیدا نکردم</p>
              </div>
            </div>
          </Radio>
          <Radio
            className={'!py-4 !px-5'}
            value="UJSES_Employee"
          >
            <div className="flex items-center gap-4">
              <div className="max-w-12">
                <img
                  alt="radio"
                  src="/images/seqs1-radio3.webp"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-text-dark">شغلی که در حال حاضر دارم رو دوست ندارم</p>
                <p className="text-text-light-25 text-sm">به دنبال یک شغل مناسب برای خودم هستم</p>
              </div>
            </div>
          </Radio>
        </RadioGroup>
      </div>
      <div className="flex-1 max-w-[400px]">
        <img
          alt="start evaluation questions 1"
          src="/images/seqs1.webp"
        />
      </div>
    </div>
  )
}

export default StepOne

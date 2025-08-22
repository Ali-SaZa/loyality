import React from 'react'
import { CheckboxGroup } from '@nextui-org/checkbox'

import Checkbox from '@/components/formElements/Checkbox'

interface StepSixProps {
  value: string[]
  onValueChange: (value: string[]) => void
}

const StepSix = ({ value, onValueChange }: StepSixProps) => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center gap-5 md:gap-16">
      <div className="flex-1 flex flex-col gap-10">
        <p className="text-text-dark text-[24px] md:text-[32px] text-center md:text-start">کدوم یکی از برندهای زیر رو بیشتر دوست داری؟</p>
        <CheckboxGroup
          classNames={{
            base: 'w-full',
            wrapper: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6',
          }}
          value={value}
          onChange={onValueChange}
        >
          <Checkbox
            className="h-[70px]"
            value="google"
          >
            <div className="max-w-16 mx-auto">
              <img
                alt="start evaluation questions 1"
                src="/images/brands/google.webp"
              />
            </div>
          </Checkbox>
          <Checkbox
            className="h-[70px]"
            value="apple"
          >
            <div className="max-w-16 mx-auto">
              <img
                alt="start evaluation questions 1"
                src="/images/brands/apple.webp"
              />
            </div>
          </Checkbox>
          <Checkbox
            className="h-[70px]"
            value="bcg"
          >
            <div className="max-w-16 mx-auto">
              <img
                alt="start evaluation questions 1"
                src="/images/brands/bcg.webp"
              />
            </div>
          </Checkbox>
          <Checkbox
            className="h-[70px]"
            value="walmart"
          >
            <div className="max-w-16 mx-auto">
              <img
                alt="start evaluation questions 1"
                src="/images/brands/walmart.webp"
              />
            </div>
          </Checkbox>
          <Checkbox
            className="h-[70px]"
            value="siemens"
          >
            <div className="max-w-16 mx-auto">
              <img
                alt="start evaluation questions 1"
                src="/images/brands/siemens.webp"
              />
            </div>
          </Checkbox>
          <Checkbox
            className="h-[70px]"
            value="redBull"
          >
            <div className="max-w-16 mx-auto">
              <img
                alt="start evaluation questions 1"
                src="/images/brands/redBull.png"
              />
            </div>
          </Checkbox>
          <Checkbox
            className="h-[70px]"
            value="microsoft"
          >
            <div className="max-w-16 mx-auto">
              <img
                alt="start evaluation questions 1"
                src="/images/brands/microsoft.webp"
              />
            </div>
          </Checkbox>
        </CheckboxGroup>
      </div>
      <div className="flex-1 max-w-[400px]">
        <img
          alt="start evaluation questions 1"
          src="/images/seqs6.webp"
        />
      </div>
    </div>
  )
}

export default StepSix

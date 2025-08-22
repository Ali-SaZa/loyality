import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'

import { educationEndDateFormValidation } from '@/validation/startEvaluationQuestions'
import Input from '@/components/formElements/Input'
import CalendarIcon from '@/components/icons/CalendarIcon'

interface StepThreeProps {
  initialEducationEndDate: string
  onEducationEndDateChange: (newEducationEndDate: string) => void
}

const StepThree = ({ initialEducationEndDate, onEducationEndDateChange }: StepThreeProps) => {
  const educationEndDateForm = useForm<z.infer<typeof educationEndDateFormValidation>>({
    resolver: zodResolver(educationEndDateFormValidation),
    defaultValues: {
      educationEndDate: initialEducationEndDate,
    },
  })

  useEffect(() => {
    const selectedEducationEndDate = educationEndDateForm.watch('educationEndDate')

    onEducationEndDateChange(selectedEducationEndDate)
  }, [educationEndDateForm.watch('educationEndDate')])

  return (
    <div className="flex flex-col-reverse md:flex-row items-center gap-5 md:gap-16">
      <div className="flex-1 flex flex-col gap-10">
        <p className="text-text-dark text-[24px] md:text-[32px] text-center md:text-start">چه سالی درست تموم میشه؟ یا شده؟</p>
        <FormProvider {...educationEndDateForm}>
          <form
            key="educationEndDate"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              onlyYearPicker
              generalType="datePicker"
              iconEnd={<CalendarIcon color="#B9BAC0" />}
              name="educationEndDate"
              placeholder="انتخاب کنید"
              size="lg"
            />
          </form>
        </FormProvider>
      </div>
      <div className="flex-1 max-w-[400px]">
        <img
          alt="start evaluation questions 1"
          src="/images/seqs3.webp"
        />
      </div>
    </div>
  )
}

export default StepThree

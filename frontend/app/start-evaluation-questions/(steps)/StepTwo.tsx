import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Chip } from '@nextui-org/chip'
import toast from 'react-hot-toast'

import { jobCategoryIdFormValidation } from '@/validation/startEvaluationQuestions'
import Input from '@/components/formElements/Input'
import useLoading from '@/hooks/useLoading'
import { GET_ALL_JOB_CATEGORIES_ROOT } from '@/services/jobCategories'

interface StepTwoProps {
  initialJobCategoryIds: string[]
  onJobCategoryIdsChange: (newJobCategoryId: string) => void
  handleRemoveJobCategory: (jobCategoryId: string) => void
}

const StepTwo = ({ initialJobCategoryIds, onJobCategoryIdsChange, handleRemoveJobCategory }: StepTwoProps) => {
  const { setLoading } = useLoading()
  const [rootCategories, setRootCategories] = useState<any>([])
  const jobCategoryIdForm = useForm<z.infer<typeof jobCategoryIdFormValidation>>({
    resolver: zodResolver(jobCategoryIdFormValidation),
    defaultValues: {
      jobCategoryId: '',
    },
  })

  const getRootCategories = async () => {
    try {
      setLoading(true)
      const response = await GET_ALL_JOB_CATEGORIES_ROOT()

      setRootCategories(response.data.jobCategories)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getRootCategories()
  }, [])

  useEffect(() => {
    const selectedCategoryId = jobCategoryIdForm.getValues('jobCategoryId')

    const foundCategory = initialJobCategoryIds?.find((categoryId: string) => categoryId === selectedCategoryId)

    if (foundCategory) {
      toast.error('این حوزه فعالیتی قبلا انتخاب شده است')
    }
    if (selectedCategoryId && !foundCategory) {
      onJobCategoryIdsChange(selectedCategoryId)
    }
    jobCategoryIdForm.reset()
    // اعمال blur
    const element = document.querySelector('[name="jobCategoryId"]') as HTMLInputElement

    if (element) {
      element.blur()
    }
  }, [jobCategoryIdForm.watch('jobCategoryId')])

  return (
    <div className="flex flex-col-reverse md:flex-row items-center gap-5 md:gap-16">
      <div className="flex-1 md:max-w-[64%] flex flex-col gap-10">
        <p className="text-text-dark text-[24px] md:text-[32px] text-center md:text-start">کدوم حوزه ی فعالیتی رو بیشتر دوست داری؟</p>
        <div className="flex flex-col gap-2">
          <FormProvider {...jobCategoryIdForm}>
            <form key="jobCategoryId">
              <Input
                apiField="jobCategories"
                generalType="combobox"
                name="jobCategoryId"
                placeholder="انتخاب کنید"
                searchMode="local"
                selectKey="id"
                selectValue="title"
                size="lg"
                url="/job-categories/all/visitor"
              />
            </form>
          </FormProvider>
          <div className="flex items-center flex-wrap gap-2">
            {initialJobCategoryIds?.map((jobCategoryId) => (
              <Chip
                key={jobCategoryId}
                radius="sm"
                onClose={() => handleRemoveJobCategory(jobCategoryId)}
              >
                {rootCategories?.find((item: any) => item?.id === jobCategoryId)?.title}
              </Chip>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 max-w-[400px]">
        <img
          alt="start evaluation questions 1"
          src="/images/seqs2.webp"
        />
      </div>
    </div>
  )
}

export default StepTwo

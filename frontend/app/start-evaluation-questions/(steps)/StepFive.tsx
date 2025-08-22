import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Chip } from '@nextui-org/chip'
import toast from 'react-hot-toast'

import { countryIdFormValidation } from '@/validation/startEvaluationQuestions'
import Input from '@/components/formElements/Input'
import useLoading from '@/hooks/useLoading'
import { GET_COUNTRY_BY_ID } from '@/services/geo'

interface StepFiveProps {
  initialCountryIds: string[]
  onCountryIdsChange: (newCountryId: string) => void
  handleRemoveCountry: (countryId: string) => void
}

const StepFive = ({ initialCountryIds, onCountryIdsChange, handleRemoveCountry }: StepFiveProps) => {
  const { setLoading } = useLoading()
  const [countries, setCountries] = useState<any>([])
  const countryIdForm = useForm<z.infer<typeof countryIdFormValidation>>({
    resolver: zodResolver(countryIdFormValidation),
    defaultValues: {
      countryId: '',
    },
  })

  const getSelectedCountryById = async (countryId: string) => {
    try {
      setLoading(true)
      const response = await GET_COUNTRY_BY_ID(countryId)

      setCountries((prev: any) => [...prev, response.data])
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const selectedCountryId = countryIdForm.watch('countryId')
    const foundCountry = initialCountryIds?.find((countryId: string) => countryId === selectedCountryId)

    if (foundCountry) {
      toast.error('این کشور قبلا انتخاب شده است')
    }
    if (selectedCountryId && !foundCountry) {
      getSelectedCountryById(selectedCountryId)
      onCountryIdsChange(selectedCountryId)
    }
    countryIdForm.reset()
    const element = document.querySelector('[name="countryId"]') as HTMLInputElement

    if (element) {
      element.blur()
    }
  }, [countryIdForm.watch('countryId')])

  return (
    <div className="flex flex-col-reverse md:flex-row items-center gap-5 md:gap-16">
      <div className="flex-1 md:max-w-[64%] flex flex-col gap-10">
        <p className="text-text-dark text-[24px] md:text-[32px] text-center md:text-start">توی چه کشورهایی دوست داری کار پیدا کنی؟</p>
        <div className="flex flex-col gap-2">
          <FormProvider {...countryIdForm}>
            <form key="countryId">
              <Input
                generalType="combobox"
                name="countryId"
                placeholder="انتخاب کنید"
                selectKey="id"
                selectValue="nativeName"
                size="lg"
                url="/geo/countries"
              />
            </form>
          </FormProvider>
          <div className="flex items-center flex-wrap gap-2">
            {initialCountryIds?.map((countryId) => (
              <Chip
                key={countryId}
                radius="sm"
                onClose={() => handleRemoveCountry(countryId)}
              >
                {countries?.find((item: any) => item?.id === countryId)?.nativeName}
              </Chip>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 max-w-[400px]">
        <img
          alt="start evaluation questions 1"
          src="/images/seqs5.webp"
        />
      </div>
    </div>
  )
}

export default StepFive

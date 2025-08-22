'use client'
import React, { useMemo, useState } from 'react'
import { Progress } from '@heroui/progress'
import { useRouter } from 'next/navigation'

import Button from '@/components/formElements/Button'
import AngleDoubleRightIcon from '@/components/icons/AngleDoubleRightIcon'
import AngleDoubleLeftIcon from '@/components/icons/AngleDoubleLeftIcon'
import StepOne from '@/app/start-evaluation-questions/(steps)/StepOne'
import StepTwo from '@/app/start-evaluation-questions/(steps)/StepTwo'
import StepThree from '@/app/start-evaluation-questions/(steps)/StepThree'
import StepFour from '@/app/start-evaluation-questions/(steps)/StepFour'
import StepFive from '@/app/start-evaluation-questions/(steps)/StepFive'
import StepSix from '@/app/start-evaluation-questions/(steps)/StepSix'
import StepSeven from '@/app/start-evaluation-questions/(steps)/StepSeven'
import { SUBMIT_EVALUATION_QUESTIONS } from '@/services/user'
import useLoading from '@/hooks/useLoading'

export type skillsFinalDataType = { skillId: string; level: string }

const StartEvaluationQuestions = () => {
  const router = useRouter()
  const { setLoading } = useLoading()

  const [step, setStep] = useState(1) //1
  const [jobStatus, setJobStatus] = useState('')
  const [favoriteJobCategoryIds, setFavoriteJobCategoryIds] = useState<string[]>([])
  const [finishEducationYear, setFinishEducationYear] = useState('')
  const [skills, setSkills] = useState<skillsFinalDataType[]>([])
  const [favoriteCountryIds, setFavoriteCountryIds] = useState<string[]>([])
  const [favoriteOrganizations, setFavoriteOrganizations] = useState<string[]>([])

  const handleJobCategoryIdsChange = (newJobCategoryId: string) => {
    setFavoriteJobCategoryIds((prev) => [...prev, newJobCategoryId]) // تابع برای بروزرسانی مقادیر
  }
  const handleRemoveJobCategory = (jobCategoryId: string) => {
    setFavoriteJobCategoryIds((prev) => prev.filter((item) => item !== jobCategoryId))
  }

  const handleCountryIdsChange = (newCountryId: string) => {
    setFavoriteCountryIds((prev) => [...prev, newCountryId]) // تابع برای بروزرسانی مقادیر
  }
  const handleRemoveCountry = (countryId: string) => {
    setFavoriteCountryIds((prev) => prev.filter((item) => item !== countryId))
  }

  const handleSkillsDataChange = (selectedSkillId: string, level: string) => {
    let copySkills = [...skills]

    copySkills = copySkills.filter((item: skillsFinalDataType) => item.skillId !== selectedSkillId)
    copySkills.push({ skillId: selectedSkillId, level })
    setSkills(copySkills)
  }
  const handleRemoveSkill = (skillId: string) => {
    setSkills((prev) => prev.filter((item) => item?.skillId !== skillId))
  }

  const handleSubmitEvaluationQuestions = async () => {
    try {
      setLoading(true)
      const response = await SUBMIT_EVALUATION_QUESTIONS({
        jobStatus,
        favoriteJobCategoryIds,
        finishEducationYear: Number(finishEducationYear.split('-')[0]),
        skills,
        favoriteCountryIds: Array.from(favoriteCountryIds).filter((item) => item !== ''),
        favoriteOrganizations,
      })

      // router.replace('/start-evaluation-questions/suitable-simulators')
      router.replace('/simulators')
    } finally {
      setLoading(false)
    }
  }

  const backButton = useMemo(() => {
    switch (step) {
      case 1:
        return {
          text: 'بازگشت به صفحه قبل',
          to: '/evaluation-questions',
        }
      default:
        return {
          text: 'قبلی',
          action: () => {
            setStep((prev) => --prev)
          },
        }
    }
  }, [step])

  const nextButton = useMemo(() => {
    return {
      text: step === 7 ? 'نمایش نتایج شما' : 'بعدی',
      disabled:
        (step === 1 && !jobStatus) ||
        (step === 2 && !favoriteJobCategoryIds?.length) ||
        (step === 3 && (!finishEducationYear || finishEducationYear.split('-')[0]?.startsWith('0'))) ||
        (step === 4 && !skills?.length) ||
        (step === 5 && !favoriteCountryIds?.length) ||
        (step === 6 && !favoriteOrganizations?.length),
      action: () => {
        if (step < 7) {
          setStep((prev) => ++prev)
        } else {
          handleSubmitEvaluationQuestions()
        }
      },
    }
  }, [step, jobStatus, favoriteJobCategoryIds, finishEducationYear, favoriteCountryIds, favoriteOrganizations, skills])

  return (
    <section className="w-full h-full flex flex-col gap-8 md:gap-16 overflow-x-hidden">
      <div>
        <Progress
          aria-label="step..."
          className="w-full rotate-180"
          color="primary"
          maxValue={7}
          minValue={0}
          value={step}
        />
        <p className="text-sm mt-2">مرحله {step} از 7</p>
      </div>
      {step === 1 && (
        <StepOne
          value={jobStatus}
          onValueChange={setJobStatus}
        />
      )}
      {step === 2 && (
        <StepTwo
          handleRemoveJobCategory={handleRemoveJobCategory}
          initialJobCategoryIds={favoriteJobCategoryIds}
          onJobCategoryIdsChange={handleJobCategoryIdsChange}
        />
      )}
      {step === 3 && (
        <StepThree
          initialEducationEndDate={finishEducationYear}
          onEducationEndDateChange={setFinishEducationYear}
        />
      )}
      {step === 4 && (
        <StepFour
          handleRemoveSkill={handleRemoveSkill}
          initialSkillsData={skills}
          onSkillsDataChange={handleSkillsDataChange}
        />
      )}
      {step === 5 && (
        <StepFive
          handleRemoveCountry={handleRemoveCountry}
          initialCountryIds={favoriteCountryIds}
          onCountryIdsChange={handleCountryIdsChange}
        />
      )}
      {step === 6 && (
        <StepSix
          value={favoriteOrganizations}
          onValueChange={setFavoriteOrganizations}
        />
      )}
      {step === 7 && <StepSeven />}
      <div className="flex items-center gap-6">
        <Button
          iconStart={<AngleDoubleRightIcon className="size-6 min-w-6" />}
          size="lg"
          to={backButton?.to}
          variant="bordered"
          onClick={backButton.action}
        >
          {backButton.text}
        </Button>
        <Button
          className="w-full md:w-fit"
          disabled={nextButton.disabled}
          iconEnd={<AngleDoubleLeftIcon />}
          size="lg"
          onClick={nextButton.action}
        >
          {nextButton.text}
        </Button>
      </div>
    </section>
  )
}

export default StartEvaluationQuestions

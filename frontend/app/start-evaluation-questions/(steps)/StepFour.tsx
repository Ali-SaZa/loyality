import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { RadioGroup } from '@nextui-org/radio'
import { Chip } from '@nextui-org/chip'
import toast from 'react-hot-toast'

import { skillIdFormValidation } from '@/validation/startEvaluationQuestions'
import Input from '@/components/formElements/Input'
import useLoading from '@/hooks/useLoading'
import { GET_ALL_SKILLS } from '@/services/skills'
import AccordionSection from '@/components/ui/AccordionSection'
import Radio from '@/components/formElements/Radio'
import { skillsFinalDataType } from '@/app/start-evaluation-questions/page'
import Alert from '@/components/utils/Alert'

interface StepFourProps {
  initialSkillsData: skillsFinalDataType[]
  onSkillsDataChange: (selectedSkillId: string, level: string) => void
  handleRemoveSkill: (skillId: string) => void
}

const StepFour = ({ initialSkillsData = [], onSkillsDataChange, handleRemoveSkill }: StepFourProps) => {
  const { setLoading } = useLoading()
  const [skills, setSkills] = useState([])
  const [selectedSkills, setSelectedSkills] = useState<any[]>([])
  const skillIdForm = useForm<z.infer<typeof skillIdFormValidation>>({
    resolver: zodResolver(skillIdFormValidation),
    defaultValues: {
      skillId: '',
    },
  })

  const getAllSkills = async () => {
    try {
      setLoading(true)
      const response = await GET_ALL_SKILLS()

      setSkills(response.data.data)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllSkills()
  }, [])

  useEffect(() => {
    if (selectedSkills.length < 3) {
      const skillId = skillIdForm.getValues('skillId')

      const foundSkill = selectedSkills.find((skill: any) => skill?.id === skillId)

      if (foundSkill) {
        toast.error('این مهارت قبلا انتخاب شده است')
      } else if (skillId) {
        const skill: any = skills.find((skill: any) => skill?.id === skillId)

        setSelectedSkills((prev) => [...prev, skill])
        onSkillsDataChange(skill?.id, 'UJSESL_Beginner')
      }
    }
    skillIdForm.reset()
    const element = document.querySelector('[name="skillId"]') as HTMLInputElement

    if (element) {
      element.blur()
    }
  }, [skillIdForm.watch('skillId'), skills, selectedSkills])

  useEffect(() => {
    setSelectedSkills(skills?.filter((skill: any) => initialSkillsData?.find((item) => item?.skillId === skill?.id)))
  }, [initialSkillsData, skills])

  return (
    <div className="flex flex-col-reverse md:flex-row items-center gap-5 md:gap-16">
      <div className="flex-1 w-full md:max-w-[64%] flex flex-col gap-10">
        <div className="flex flex-col gap-4 text-center md:text-start">
          <p className="text-text-dark text-[24px] md:text-[32px]">فکر میکنی چه مهارتی داری؟</p>
          <p>حداکثر سه مهارت را انتخاب کنید.</p>
        </div>
        <div className="flex flex-col gap-2">
          {selectedSkills?.length < 3 && (
            <FormProvider {...skillIdForm}>
              <form key="skillId">
                {!!skills?.length && (
                  <Input
                    generalType="combobox"
                    name="skillId"
                    placeholder="انتخاب کنید"
                    selectKey="id"
                    selectValue="title"
                    size="lg"
                    url="/skills"
                  />
                )}
              </form>
            </FormProvider>
          )}
          <div className="flex items-center flex-wrap gap-2">
            {selectedSkills?.map((selectedSkill: any) => (
              <Chip
                key={selectedSkill?.id}
                radius="sm"
                onClose={() => handleRemoveSkill(selectedSkill?.id)}
              >
                {selectedSkill.title}
              </Chip>
            ))}
          </div>
        </div>
        {!!selectedSkills?.length && (
          <div className="bg-background-20 flex flex-col gap-2 py-2 px-2 rounded-xl ">
            <p className="py-2 text-lg md:text-xl text-text-dark text-center md:text-start">توی مهارت هایی که انتخاب کردی سطحت چیه؟</p>
            <Alert title="اگر برای مهارت هات سطحی انتخاب نکنی ،سطحت در اون مهارت مبتدی در نظر گرفته میشه!" />
            {selectedSkills?.map((selectedSkill) => (
              <AccordionSection
                key={selectedSkill?.id}
                defaultExpanded
                title={selectedSkill?.title}
              >
                <RadioGroup
                  className="w-full"
                  value={initialSkillsData?.find((item) => item?.skillId === selectedSkill?.id)?.level}
                  onValueChange={(value: string) => onSkillsDataChange(selectedSkill?.id, value)}
                >
                  <Radio
                    className={'!py-4 !px-5'}
                    value={'UJSESL_Beginner'}
                  >
                    <div className="flex items-center gap-4">
                      <div className="max-w-12">
                        <img
                          alt="radio"
                          src="/images/seqs4-radio3.webp"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-text-dark">تازه کارم</p>
                        <p className="text-text-light-25 text-sm">من تازه دارم شروع میکنم</p>
                      </div>
                    </div>
                  </Radio>
                  <Radio
                    className={'!py-4 !px-5'}
                    value={'UJSESL_Intermediate'}
                  >
                    <div className="flex items-center gap-4">
                      <div className="max-w-12">
                        <img
                          alt="radio"
                          src="/images/seqs4-radio2.webp"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-text-dark">متوسطم</p>
                        <p className="text-text-light-25 text-sm">من در حال حاضر دبیرستان هستم و هنوز فارغ التحصیل نشده ام</p>
                      </div>
                    </div>
                  </Radio>
                  <Radio
                    className={'!py-4 !px-5'}
                    value={'UJSESL_Advanced'}
                  >
                    <div className="flex items-center gap-4">
                      <div className="max-w-12">
                        <img
                          alt="radio"
                          src="/images/seqs4-radio1.webp"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-text-dark">حرفه ای ام</p>
                        <p className="text-text-light-25 text-sm">
                          من احساس می کنم برای انجام آخرین فشار برای رسیدن به شغل رویایی خود مجهز هستم
                        </p>
                      </div>
                    </div>
                  </Radio>
                </RadioGroup>
              </AccordionSection>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 max-w-[400px] h-full">
        <img
          alt="start evaluation questions 1"
          className="sticky top-0"
          src="/images/seqs4.webp"
        />
      </div>
    </div>
  )
}

export default StepFour

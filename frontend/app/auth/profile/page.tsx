'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import Button from '@/components/formElements/Button'
import Input from '@/components/formElements/Input'
import AngleDoubleLeftIcon from '@/components/icons/AngleDoubleLeftIcon'
import AngleDoubleRightIcon from '@/components/icons/AngleDoubleRightIcon'
import CalendarIcon from '@/components/icons/CalendarIcon'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon'
import ObsLogo from '@/components/ui/ObsLogo'
import Stepper from '@/components/utils/Stepper'
import { convertToDateString, formatDateToCustomTimezone, getFullName, removeEmptyFields } from '@/helpers'
import useAuth from '@/hooks/useAuth'
import useGlobal from '@/hooks/useGlobal'
import useLoading from '@/hooks/useLoading'
import { UPDATE_USER_PROFILE } from '@/services/user'
import { educationalInformationFormValidation, personalInformationFormValidation } from '@/validation/profile'

const ProfileDefaultValues = {
  // step 1
  firstName: '',
  lastName: '',
  password: '',
  birthdate: '',
  sex: undefined,
  stateId: '',
  cityId: '',
  nationalCode: '',
  howMeetUs: '',

  // step 2
  educationStatus: '',
  educationLevel: '',
  educationName: '',
  majorId: '',
  educationStartDate: '',
  educationEndDate: '',
  workHistory: '',
}

const Profile = () => {
  const router = useRouter()
  const { user, updateUserFromOutside, saveUser } = useAuth()
  const { data } = useGlobal()
  const { setLoading } = useLoading()

  const [step, setStep] = useState(0)
  const stepsDetail = [
    {
      step: 0,
      text: 'اطلاعات اولیه',
    },
    {
      step: 1,
      text: 'آموزشی',
    },
  ]
  const alertsDetail = [
    {
      step: 0,
      title: `${user?.firstname ? 'ویرایش' : 'ایجاد'} حساب کاربری`,
      description: `${user?.firstname ? 'ویرایش' : 'ایجاد'} حساب کاربری ${user?.firstname ? '' : 'برای'} ${user?.firstname && user?.lastname ? getFullName(user.firstname, user.lastname) : user?.phoneNumber}`,
    },
    {
      step: 1,
      title: 'آموزشی',
      description:
        'جزئیات مربوط به تحصیلات شما برای ارتباط شما با کارفرمایان، شبیه سازی های شغلی، مشاغل، شبکه های استعدادیابی، رویدادها و فرصت های دیگر استفاده می شود.',
    },
  ]
  const currentAlertDetail = () => alertsDetail.find((alert) => alert.step === step)

  const personalInformationForm = useForm<z.infer<typeof personalInformationFormValidation>>({
    resolver: zodResolver(personalInformationFormValidation),
    defaultValues: {
      ...ProfileDefaultValues,
    },
  })
  const educationalInformationForm = useForm<z.infer<typeof educationalInformationFormValidation>>({
    resolver: zodResolver(educationalInformationFormValidation),
    defaultValues: {
      ...ProfileDefaultValues,
    },
  })

  const submitProfile = async (data: z.infer<typeof educationalInformationFormValidation>) => {
    try {
      setLoading(true)
      let profileData = {
        ...personalInformationForm.getValues(),
        ...data,
        education: {
          status: educationalInformationForm.getValues('educationStatus'),
          level: educationalInformationForm.getValues('educationLevel'),
          name: educationalInformationForm.getValues('educationName'),
          majorId: educationalInformationForm.getValues('majorId'),
          startDate: educationalInformationForm.getValues('educationStartDate'),
          ...(educationalInformationForm.getValues('educationStatus') === 'UES_Completed' && {
            endDate: educationalInformationForm.getValues('educationEndDate'),
          }),
        },
      }

      let newProfileData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        password: profileData.password,
        birthdate: profileData.birthdate,
        sex: profileData.sex,
        stateId: profileData.stateId,
        cityId: profileData.cityId,
        howMeetUs: profileData.howMeetUs,
        education: profileData.education,
        workHistory: profileData.workHistory,
        nationalCode: profileData.nationalCode,
      }

      if (user?.firstname) {
        delete newProfileData.password
      }

      const editedData = removeEmptyFields(newProfileData)
      const response = await UPDATE_USER_PROFILE(editedData)

      if (response) {
        if (response?.data?.accessToken && response?.data?.refreshToken) {
          await saveUser({ accessToken: response.data.accessToken, refreshToken: response.data.refreshToken })
        } else {
          updateUserFromOutside(newProfileData)
        }
        toast.success('پروفایل شما با موفقیت بروزرسانی شد.')
        router.back()
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackClick = () => {
    if (step > 0) {
      setStep(step - 1)
    } else {
      router.back()
    }
  }

  useEffect(() => {
    if (!user) return

    const personalInformationFormData = {
      firstName: user.firstname ?? '',
      lastName: user.lastname ?? '',
      password: user.password ?? '',
      birthdate: user.birthdate ?? '',
      sex: user.sex ?? undefined,
      stateId: user.stateId ?? '',
      cityId: user.cityId ?? '',
      nationalCode: user.nationalCode ?? '',
      howMeetUs: user.howMeetUs ?? '',
    }

    const educationalInformationFormData = {
      educationStatus: user.education?.status ?? '',
      educationName: user.education?.name ?? '',
      educationLevel: user.education?.level ?? '',
      majorId: user.education?.majorId ?? '',
      educationStartDate: user.education?.startDate ?? '',
      educationEndDate: user.education?.endDate ?? '',
      workHistory: user.workHistory ?? '',
    }

    personalInformationForm.reset(personalInformationFormData)
    educationalInformationForm.reset(educationalInformationFormData)
  }, [user])

  useEffect(() => {
    const subscription = personalInformationForm.watch((value, { name }) => {
      if (name === 'stateId') {
        personalInformationForm.setValue('cityId', '')
      }
    })

    return () => subscription.unsubscribe()
  }, [personalInformationForm])

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden relative flex flex-col">
      <div className="flex items-center gap-4">
        {user && (
          <Button
            iconOnly
            className="!rounded-full border-1"
            color="default"
            variant="bordered"
            onClick={handleBackClick}
          >
            <ChevronRightIcon className="size-4 text-text" />
          </Button>
        )}
        <ObsLogo />
      </div>
      <div className="mt-8 w-full flex justify-center">
        <Stepper
          currentStep={step}
          numberOfSteps={2}
          stepsDetail={stepsDetail}
        />
      </div>
      <div className="p-0 md:container mt-8 h-full flex flex-col">
        <div className="mx-auto rounded-lg bg-background-secondary flex flex-col px-10 py-6 gap-4 w-full">
          <h2 className="font-bold text-lg md:text-2xl ">{currentAlertDetail()!.title}</h2>
          {user && <p className="text-sm md:text-medium">{currentAlertDetail()!.description}</p>}
        </div>
        {step === 0 && (
          <FormProvider {...personalInformationForm}>
            <form
              onSubmit={personalInformationForm.handleSubmit(
                () => setStep(step + 1),
                (error) => {
                  const errorLength = Object.keys(error)?.length

                  if (errorLength === 1 && error.password && user && user?.firstname) {
                    setStep(step + 1)
                  }
                }
              )}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <Input
                  required
                  generalType="input"
                  inputType="text"
                  label="نام"
                  name="firstName"
                  placeholder="نام"
                  size="lg"
                />
                <Input
                  required
                  generalType="input"
                  inputType="text"
                  label="نام خانوادگی"
                  name="lastName"
                  placeholder="نام خانوادگی"
                  size="lg"
                />
              </div>
              {!user?.firstname && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <Input
                    required
                    description="رمز عبور باید حداقل 6 کاراکتر باشد."
                    generalType="input"
                    inputType="password"
                    label="رمز عبور"
                    name="password"
                    placeholder="رمز عبور"
                    size="lg"
                  />
                  <Input
                    required
                    description="تکرار رمز عبور باید حداقل 6 کاراکتر باشد."
                    generalType="input"
                    inputType="password"
                    label="تکرار رمز عبور"
                    name="confirmPassword"
                    placeholder="تکرار رمز عبور"
                    size="lg"
                  />
                </div>
              )}
              <div className="w-full border border-dashed mt-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 items-start">
                {/*<Input*/}
                {/*  generalType="datePicker"*/}
                {/*  iconEnd={<CalendarIcon color="#B9BAC0" />}*/}
                {/*  label="تاریخ تولد"*/}
                {/*  maxDate={convertToDateString(formatDateToCustomTimezone(new Date()))}*/}
                {/*  name="birthdate"*/}
                {/*  placeholder="انتخاب کنید"*/}
                {/*  size="lg"*/}
                {/*/>*/}
                <Input
                  description={
                    <div className="flex items-center">
                      برای باز شدن تقویم، روی{' '}
                      <CalendarIcon
                        className="size-3 mx-1"
                        color="#a1a1aa"
                      />{' '}
                      کلیک کن.
                    </div>
                  }
                  generalType="datePickerPro"
                  label="تاریخ تولد"
                  name="birthdate"
                  placeholder="انتخاب کنید"
                  size="lg"
                />
                <Input
                  generalType="select"
                  label="جنسیت"
                  name="sex"
                  placeholder="جنسیت"
                  selectOptions={data.sex}
                  size="lg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <Input
                  required
                  generalType="combobox"
                  label="استان محل سکونت"
                  name="stateId"
                  placeholder="استان محل سکونت"
                  searchMode="local"
                  selectKey="id"
                  selectValue="nativeName"
                  size="lg"
                  url="/geo/states/country-code/IR"
                />
                {personalInformationForm.watch('stateId') && (
                  <Input
                    key={personalInformationForm.watch('stateId')}
                    required
                    filterName="stateId"
                    filterValue={personalInformationForm.watch('stateId')}
                    generalType="combobox"
                    label="شهر محل سکونت"
                    name="cityId"
                    pageSize={1000}
                    placeholder="شهر محل سکونت"
                    searchMode="local"
                    selectKey="id"
                    selectValue="nativeName"
                    size="lg"
                    url="/geo/cities"
                  />
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <Input
                  required
                  generalType="input"
                  inputType="text"
                  label="کد ملی"
                  name="nationalCode"
                  placeholder="کد ملی"
                  size="lg"
                />
              </div>
              <div className="w-full border border-dashed mt-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <Input
                  generalType="select"
                  label="چگونه با ما آشنا شدید"
                  name="howMeetUs"
                  placeholder="چگونه با ما آشنا شدید"
                  selectOptions={data.howMeetUs}
                  size="lg"
                />
              </div>
              <div className="w-full flex justify-end mt-10 mb-12">
                <Button
                  className="grow md:grow-0"
                  iconEnd={<AngleDoubleLeftIcon />}
                  type="submit"
                >
                  مرحله بعد
                </Button>
              </div>
            </form>
          </FormProvider>
        )}
        {step === 1 && (
          <FormProvider {...educationalInformationForm}>
            <form onSubmit={educationalInformationForm.handleSubmit(submitProfile)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <Input
                  required
                  generalType="select"
                  label="سطح تحصیلی"
                  name="educationLevel"
                  placeholder="سطح تحصیلی"
                  selectOptions={data.educationLevel}
                  size="lg"
                />
                <Input
                  required
                  generalType="combobox"
                  label="رشته"
                  name="majorId"
                  placeholder="رشته"
                  selectKey="id"
                  selectValue="title"
                  size="lg"
                  url="/majors"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <Input
                  generalType="select"
                  label="وضعیت تحصیلی"
                  name="educationStatus"
                  placeholder="وضعیت تحصیلی"
                  selectOptions={data.educationStatus}
                  size="lg"
                />
                <Input
                  generalType="input"
                  inputType="text"
                  label="نام دانشگاه یا دبیرستان"
                  name="educationName"
                  placeholder=" نام دانشگاه یا دبیرستان"
                  size="lg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <Input
                  onlyYearPicker
                  generalType="datePicker"
                  iconEnd={<CalendarIcon color="#B9BAC0" />}
                  label="سال شروع اخرین مقطع تحصیلی"
                  maxDate={convertToDateString(formatDateToCustomTimezone(new Date()))}
                  name="educationStartDate"
                  placeholder="انتخاب کنید"
                  size="lg"
                />
                {educationalInformationForm.watch('educationStatus') === 'UES_Completed' && (
                  <Input
                    onlyYearPicker
                    generalType="datePicker"
                    iconEnd={<CalendarIcon color="#B9BAC0" />}
                    label="سال فارغ التحصیلی"
                    name="educationEndDate"
                    placeholder="انتخاب کنید"
                    size="lg"
                  />
                )}
              </div>
              <Input
                className="mt-8"
                generalType="textarea"
                label="سابقه کاری دارید؟"
                name="workHistory"
                placeholder="سابقه کاری"
                size="lg"
              />
              <div className="w-full flex justify-end mt-10 mb-12 gap-2">
                <Button
                  iconStart={<AngleDoubleRightIcon />}
                  type="button"
                  variant="bordered"
                  onClick={() => setStep(step - 1)}
                >
                  قبلی
                </Button>
                <Button
                  className="grow md:grow-0"
                  iconEnd={<AngleDoubleLeftIcon />}
                  type="submit"
                >
                  تکمیل
                </Button>
              </div>
            </form>
          </FormProvider>
        )}
      </div>
    </div>
  )
}

export default Profile

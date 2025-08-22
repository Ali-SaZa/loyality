'use client'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import IntroHeader from '@/components/ui/IntroHeader'
import Button from '@/components/formElements/Button'
import PhoneIcon from '@/components/icons/PhoneIcon'
import MailIcon from '@/components/icons/MailIcon'
import HomeLocationIcon from '@/components/icons/HomeLocationIcon'
import InstagramIcon from '@/components/icons/InstagramIcon'
import LinkedInIcon from '@/components/icons/LinkedInIcon'
import TelegramIcon from '@/components/icons/TelegramIcon'
import Input from '@/components/formElements/Input'
import useGlobal from '@/hooks/useGlobal'
import { organizationFormValidation } from '@/validation/organization'
import useLoading from '@/hooks/useLoading'
import { CREATE_JOB_SIMULATION_REQUEST } from '@/services/jobSimulationRequest'

const organizationDefaultValues = {
  fullName: '',
  jobTitle: '',
  organizationName: '',
  mobile: '',
  email: '',
  howMeetUs: '',
  employeeCount: 0,
  industryId: '',
  description: '',
}

const OrganizationsRequest = () => {
  const { data } = useGlobal()
  const { setLoading } = useLoading()

  const organizationForm = useForm<z.infer<typeof organizationFormValidation>>({
    resolver: zodResolver(organizationFormValidation),
    defaultValues: {
      ...organizationDefaultValues,
    },
  })

  const sendOrganizationForm = async (data: z.infer<typeof organizationFormValidation>) => {
    try {
      setLoading(true)
      console.log(data)
      await CREATE_JOB_SIMULATION_REQUEST(data)

      toast.success('درخواست شما با موفقیت ثبت شد')
      organizationForm.reset()
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="pt-16">
      <IntroHeader
        desktopHeight={321}
        mobileHeight={252}
        url={'/images/organizations-header.webp'}
      >
        <div className="text-text-dark text-4xl font-bold leading-[4rem] -mt-40">
          کسب و کار ها در
          <span className="mx-2 text-primary">OBS</span>
        </div>
      </IntroHeader>
      <div className="container py-16 flex flex-col gap-10">
        <div className="">
          <p className="text-text-dark text-2xl pb-4 text-center">سلام و خوش آمدید به OBS!</p>
          <p className="font-semibold text-text-dark text-lg md:text-3xl leading-8 text-center">
            با شبیه ساز شغلی <span className={'text-primary'}>OBS</span> استعدادها رو هوشمندانه کشف کن.
          </p>
        </div>
        <div className="flex items-center justify-center w-full ">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto rounded-lg"
          >
            <source
              src="/videos/request-organizations.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
        <p className="text-start text-medium md:text-lg text-text-dark">
          با ثبت درخواست همکاری با OBS، پس از برگزاری جلسه با مشاورین کسب و کار ما، مسیری اختصاصی جهت سیستم‌سازی و توسعه‌ی منابع انسانی کسب
          و کار شما ترسیم خواهد شد، طی این مسیر، ما بر آنیم تا چالش‌های فعلی شما، اهداف و چشم‌اندازی آتی کسب و کار شما و آنچه را که به عنوان
          مسیر توسعه‌ی احتمالی کسب و کارتان ترسیم نموده‌ایم، در هر یک از مشاغل و نقش‌های کلیدی کسب و کارتان منعکس کنیم. لذا از طریق شبیه‌ساز
          شغلی OBS قادر خواهیم بود:
        </p>
        <div className="rounded-xl py-10 px-8 bg-background-primary relative overflow-hidden">
          <div className="absolute rounded-full size-[115px] min-h-[115px] min-w-[115px] bg-primary-5 -top-1 left-2" />
          <div className="absolute rounded-full size-[115px] min-h-[115px] min-w-[115px] bg-primary-5 -bottom-9 left-1/2 z-0" />
          <div className="z-10 text-text-dark leading-7 relative">
            بهترین و مناسب‌ترین نیروی کار را برای هر یک از نقش‌های سازمانی کسب و کار شما بیابیم.
            <br /> مسیر مهارت افزایی و توسعه‌ی توانمندی‌های نیروهای فعلی کسب و کار شما را تسهیل و عملیاتی کنیم.
            <br /> سازوکار مدیریت دانش و سیستم‌سازی فعالیت منابع انسانی کسب و کار شما رو اجرایی کنیم.
            <br /> مسیر مدیریت تغییر و تحول سازمانی کسب و کار شما را به سمت توسعه‌ی سازمانی ترسیم کنیم.
            <br /> و در نهایت برای شما ملموس‌ترین تجربه‌ی توسعه‌ی سازمانی را به ارمغان آوریم.
            <br /> <br /> ذکر این نکته خالی از لطف نیست که ما با تکیه بر دانش غنی کارآفرینی سازمانی، استراتژی‌های توسعه‌ی سازمانی و بازطراحی
            اثرساز فرآیندهای سازمانی را برای هر کسب و کار به ارمغان خواهیم آورد.
          </div>
        </div>
      </div>
      <div className="bg-primary-100 py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-10 w-full">
            <div className="max-w-[305px]">
              <img
                alt="organizations request"
                className="w-full h-full object-cover"
                src="/images/request-organizations.png"
              />
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col text-center md:text-start gap-5">
                <p className="text-white text-sm md:text-lg">بیایید با هم، برای یک رشد هوشمندانه برنامه ریزی کنیم</p>
                <p className="text-white text-lg md:text-2xl font-semibold">شبیه ساز شغلی OBS، ملموس ترین تجربه توسعه سازمانی</p>
              </div>
              <Button
                className="bg-background-primary text-primary w-full md:w-fit"
                size="lg"
                to="/simulators"
              >
                با تجربیات دیگران بیشتر آشنا شو
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container py-16 md:my-16 relative">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-3/5 p-10 md:p-[75px] flex items-center justify-center rounded-t-3xl md:rounded-tl-none  md:rounded-r-3xl bg-white shadow-medium ">
            <FormProvider {...organizationForm}>
              <form
                className="flex flex-col gap-4 md:gap-6 w-full"
                onSubmit={organizationForm.handleSubmit(sendOrganizationForm)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <Input
                    required
                    generalType="input"
                    label="نام و نام خانوادگی"
                    name="fullName"
                    placeholder="نام و نام خانوادگی"
                  />
                  <Input
                    required
                    generalType="input"
                    label="عنوان شغل"
                    name="jobTitle"
                    placeholder="عنوان شغل"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <Input
                    required
                    generalType="input"
                    inputType="tel"
                    label="شماره موبایل"
                    name="mobile"
                    placeholder="شماره موبایل"
                  />
                  <Input
                    generalType="input"
                    label="ایمیل"
                    name="email"
                    placeholder="ایمیل"
                  />
                </div>
                <Input
                  required
                  generalType="input"
                  label="نام شرکت"
                  name="organizationName"
                  placeholder="نام شرکت"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <Input
                    generalType="input"
                    inputType="number"
                    label="تعداد اعضای شرکت"
                    minValue={0}
                    name="employeeCount"
                    placeholder="تعداد اعضای شرکت"
                  />
                  <Input
                    required
                    apiField="industries"
                    generalType="combobox"
                    label="تخصص"
                    name="industryId"
                    placeholder="تخصص"
                    selectKey="id"
                    selectValue="title"
                    url="/industries/all"
                  />
                </div>
                <Input
                  generalType="select"
                  label="چگونه با ما آشنا شدید"
                  name="howMeetUs"
                  placeholder="چگونه با ما آشنا شدید"
                  selectOptions={data.jobSimulationRequestHowMeetUs}
                />
                <Input
                  generalType="textarea"
                  label="توضیحات شبیه ساز درخواستی"
                  name="description"
                  placeholder="توضیحات"
                  size="lg"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <Button
                    fullWidth
                    type="submit"
                  >
                    ارسال
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
          <div className="w-full md:w-2/5 bg-primary-100 flex flex-col justify-between gap-10 md:gap-0 p-10 rounded-b-3xl md:rounded-br-none md:rounded-l-3xl shadow-medium ">
            <div className="flex flex-col gap-[10px]">
              <p className="text-white font-bold text-xl md:text-3xl md:leading-10">ثبت درخواست برای کسب و کارها</p>
              <p className="text-[#C9C9C9]">برای شروع، با ما تماس بگیرید</p>
            </div>
            <div className="flex flex-col gap-5 md:gap-10 items-start">
              <a
                className="flex items-center gap-3 text-white"
                href="tel:09422010070,907"
              >
                <PhoneIcon className="size-6 text-white" />
                <p>09422010070</p>
              </a>
              <a
                className="flex items-center gap-3 text-white"
                href="mailto:info@obs.ir"
              >
                <MailIcon className="size-6 text-white" />
                <p>info@obs.ir</p>
              </a>
              <div className="flex gap-3 items-center text-white">
                <HomeLocationIcon className="size-6 min-w-6 min-h-6 text-white" />
                <p>شاهرود، بلوار دانشگاه، پارک علم و فناوری استان سمنان.مدیا پارک نیتک</p>
              </div>
            </div>
            <div className="flex items-center gap-[37px] mx-auto">
              <Button
                iconOnly
                target="_blank"
                to="https://www.instagram.com/obsservice/"
                variant="light"
              >
                <InstagramIcon className="size-6 text-error" />
              </Button>
              <Button
                iconOnly
                target="_blank"
                to="https://www.linkedin.com/in/onlinebusinesssimulation"
                variant="light"
              >
                <LinkedInIcon />
              </Button>
              <Button
                iconOnly
                target="_blank"
                to="https://t.me/obs_hr"
                variant="light"
              >
                <TelegramIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrganizationsRequest

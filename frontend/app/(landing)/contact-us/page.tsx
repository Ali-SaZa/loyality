'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import dynamic from 'next/dynamic'

import Button from '@/components/formElements/Button'
import HomeLocationIcon from '@/components/icons/HomeLocationIcon'
import InstagramIcon from '@/components/icons/InstagramIcon'
import LinkedInIcon from '@/components/icons/LinkedInIcon'
import MailIcon from '@/components/icons/MailIcon'
import PhoneIcon from '@/components/icons/PhoneIcon'
import TelegramIcon from '@/components/icons/TelegramIcon'
import IntroHeader from '@/components/ui/IntroHeader'
import { ContactFormValidation } from '@/validation/contact'

const Map = dynamic(() => import('@/components/utils/Map'), { ssr: false })

const ContactDefaultValues = {
  fullName: '',
  email: '',
  description: '',
}

const ContactUs = () => {
  const contactForm = useForm<z.infer<typeof ContactFormValidation>>({
    resolver: zodResolver(ContactFormValidation),
    defaultValues: {
      ...ContactDefaultValues,
    },
  })

  const sendContactForm = (data: z.infer<typeof ContactFormValidation>) => {
    console.log(data)
  }

  return (
    <section className="pt-16">
      <IntroHeader
        desktopHeight={321}
        mobileHeight={252}
        url={'/images/contact-us-header.webp'}
      >
        <div className="text-text-dark text-4xl font-bold leading-[4rem] md:leading-10 -mt-28">ارتباط با ما</div>
      </IntroHeader>

      <div className="container py-16 relative">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-3/5 p-10 md:p-[75px] flex items-center justify-center rounded-t-3xl md:rounded-tl-none  md:rounded-r-3xl bg-white shadow-medium ">
            {/* <FormProvider {...contactForm}>
              <form
                onSubmit={contactForm.handleSubmit(sendContactForm)}
                className="flex flex-col gap-4 md:gap-6 w-full"
              >
                <Input
                  generalType="input"
                  required
                  name="fullName"
                  label="نام و نام خانوادگی"
                  placeholder="نام و نام خانوادگی"
                />
                <Input
                  generalType="input"
                  required
                  name="email"
                  label="ایمیل"
                  placeholder="ایمیل"
                />
                <Input
                  generalType="textarea"
                  required
                  name="description"
                  label="توضیحات"
                  placeholder="توضیحات"
                />
                <Button
                  fullWidth
                  type="submit"
                >
                  ارسال پیام
                </Button>
              </form>
            </FormProvider> */}
            <Map
              center={[36.27759316818451, 59.595646791369546]}
              className="!h-[400px] rounded-xl "
              popup={'نیتک'}
              zoom={14}
            />
          </div>
          <div className="w-full md:w-2/5 bg-primary-100 flex flex-col justify-between gap-10 md:gap-0 p-10 rounded-b-3xl md:rounded-br-none md:rounded-l-3xl shadow-medium ">
            <div className="flex flex-col gap-[10px]">
              <p className="text-white font-bold text-xl md:text-3xl md:leading-10">اطلاعات تماس</p>
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
        <img
          alt="contact us paper"
          className="rotate-[-30deg] w-[240px] h-[112px] absolute -bottom-14 left-1/4"
          src="/images/contact-us-paper.png"
        />
      </div>
    </section>
  )
}

export default ContactUs

'use client'
import React, { useState } from 'react'

import IntroHeader from '@/components/ui/IntroHeader'
import Button from '@/components/formElements/Button' // import MemberCard from '@/components/ui/card/MemberCard'
import useWindowSize from '@/hooks/useWindowSize'
import Accordion from '@/components/ui/Accordion'

const Questions = () => {
  const { width } = useWindowSize()
  const [obsPlatformSelectedKey, setObsPlatformSelectedKey] = useState('1')

  const team = [
    {
      id: 1,
      imageUrl: '/images/team-members/ramoz.png',
      name: 'تیم راموز',
      label: 'توسعه دهنده',
      className: '',
    },
    {
      id: 2,
      imageUrl: '/images/team-members/nitech.png',
      name: 'مدیا پارک نیتک',
      label: 'بنیانگذار',
      className: '',
    },
    {
      id: 3,
      imageUrl: '/images/team-members/bahrieni.png',
      name: 'مهندس حمیدرضا بحرینی',
      label: 'هم بنیانگذار',
      className: 'object-cover',
    },
    {
      id: 4,
      imageUrl: '/images/team-members/moeinifar.png',
      name: 'مهندس وحید معینی فر',
      label: 'هم بنیانگذار',
      className: 'object-cover',
    },
    {
      id: 5,
      imageUrl: '/images/team-members/mirzayi.jpg',
      name: 'دکتر حمیدرضا میرزایی',
      label: 'هم بنیانگذار',
      className: 'object-cover',
    },
    {
      id: 6,
      imageUrl: '/images/team-members/nasiri.jpg',
      name: 'دکتر حسین نصیری',
      label: 'هم بنیانگذار و مدیرمحصول',
      className: 'object-cover',
    },
    {
      id: 7,
      imageUrl: '/images/team-members/saravani.jpg',
      name: 'نیلوفر سراوانی',
      label: 'کارشناس فنی',
      className: 'object-cover',
    },
  ]

  const accordionData3 = [
    {
      id: 1,
      key: '1',
      title: 'ثبت نام در سایت',
      content:
        'سفر هزاران کیلومتری با یک قدم شروع می‌شه، قدم اول! پس مهمه که کجا این قدم رو برمیداری. OBS دغدغه ی این رو داره به موفقیتی برسی که آرزوش رو داری و مناسبش هستی، نه نسخه ی کپی شده از مسیر دیگران. پس بیا با هم شروع کنیم.',
    },
    {
      id: 2,
      key: '2',
      title: 'انتخاب شبیه سازها',
      content:
        'خیلیا نمیدونن چه شغل های جذابی وجود داره که میتونه مناسبشون باشه، فقط بابت اینکه اسم چند تا شغل بیشتر توی رسانه ها تکرار شده، توی لیست انتخاب های همه ی ما قرار گرفته، در حالی که بازار و کسب و کارهای مختلف، تشنه ی حضور آدم های توانمندی هست که بتونن از پس کارهای مهم و بزرگ بر بیان.',
    },
    {
      id: 3,
      key: '3',
      title: 'شبیه سازی آموزشی',
      content:
        'آموزش دقیق و عمیق، مسیریه که خیلیا تا الان از پسش بر نیومدن، اینکه بر اساس کاری که قرار انجام بشه، توی فضایی که قراره اون کار شکل بگیره، مهارتی رو آموزش ببینی که مناسب همون کار، فضا و چالش عملیاتی هست و زمانت صرف مقدمات و موارد بلااستفاده نشه؛ به نسخه ی پیشنهادی OBS برای آموختن عمیق مهارت های واقعی شغلی اعتماد کن.',
    },
  ]

  return (
    <section className="pt-16">
      <IntroHeader
        desktopHeight={321}
        mobileHeight={252}
        url={'/images/about-us-header.webp'}
      >
        <div className="text-text-dark text-4xl font-bold leading-[4rem] -mt-40">
          درباره مجموعه
          <span className="mx-2 text-primary">OBS</span>
        </div>
      </IntroHeader>
      <div className="container mb-16">
        <div className="mt-10 md:mt-16 mb-10">
          <p className="text-text-dark text-2xl pb-4 text-center">سلام و خوش آمدید به OBS!</p>
          <p className="font-semibold text-text-dark text-lg md:text-3xl leading-8 text-center">
            جایی که دنیای شغل‌ها به یک ماجراجویی هیجان‌انگیز تبدیل میشه!
          </p>
        </div>
        <p className="text-center text-medium md:text-lg">
          شبیه‌ساز شغلی OBS، تمام تجربیات تخصصی یک شغل رو به صورت گام به گام در قالب ماموریت‌های کاری تفکیک شده ترسیم میکنه و با بهره‌گیری
          از ترکیب مدل یادگیری دو حلقه‌ای Argyris و مدل Bloom، رویکردی آموزشی ماندگار و اثربخش برای مهارت‌آموزی عمیق شغلی ایجاد میکنه. این
          مسیر با فضاسازی محیط یک کسب و کار و تاکید بر فعالیت‌های تخصصی هر شغل، ظرفیتی جذاب برای پیشبرد اهداف توسعه‌ی منابع انسانی کسب و
          کارها و چراغ راهی برای انتخاب آگاهانه‌ی مشاغل ایجاد خواهد کرد.
        </p>
      </div>
      <div className="bg-background-10">
        <div className="container py-10 md:py-16">
          <div className="mb-10">
            <p className="text-text-dark text-2xl pb-4 text-center">کاری که ما انجام می دهیم.</p>
            <p className="font-bold text-text-dark text-lg md:text-3xl leading-8 text-center">
              بهترین مسیر برای ورود به هر شغلی که میخوای...
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-full bg-primary-100 p-7 rounded-xl flex flex-col gap-4 md:gap-0 md:flex-row items-center relative overflow-hidden">
              <div className="size-[100px] rounded-full bg-background-10/30 absolute -left-2 -top-1 z-0" />
              <div className="size-[200px] rounded-full bg-background-10/30 absolute left-36 -bottom-1/2 z-0" />
              <div className="w-full md:w-1/3">
                <img
                  alt="job choice"
                  className="w-[206px] mx-auto"
                  src="/images/about-jobChoice.webp"
                />
              </div>
              <div className="text-white w-full md:w-2/3 text-justify md:text-start leading-6 z-10">
                ما اینجا هستیم تا به شما نشون بدیم چقدر گزینه‌های متنوع و جالب برای انتخاب شغل وجود داره. با شبیه‌سازی‌های حرفه‌ای ما،
                می‌تونید مهارت‌هایی که برای ورود به بازار کار لازم دارید رو به دست بیارید و با اعتماد به نفس بیشتری قدم بردارید.
              </div>
            </div>

            <div className="w-full bg-secondary-100 p-7 rounded-xl flex flex-col gap-4 md:gap-0 md:flex-row items-center relative overflow-hidden">
              <div className="size-[100px] rounded-full bg-background-10/30 absolute right-1/2 -top-1 z-0" />
              <div className="size-[200px] rounded-full bg-background-10/30 absolute left-1/2 -bottom-1/2 z-0" />
              <div className="text-white w-full md:w-2/3 text-justify md:text-start leading-6 z-10">
                ما در OBS متخصص استانداردسازی و فرآیندسازی مشاغل درکسب و کارها هستیم؛ چه کارمند باشین و چه کارآموز، با گذروندن این مسیرها
                می‌تونین فرآیندهای کاریتون رو به بهترین شکل ممکن استاندارد کنین. هدف اینه که کمک کنیم با تجربه‌ای واقعی، شایستگی‌های لازم رو
                به دست بیارین و دیگه در مصاحبه‌ها از برچسب «بی‌تجربه» دور بمونین.
              </div>
              <div className="w-full md:w-1/3">
                <img
                  alt="job choice"
                  className="w-[290px] mx-auto"
                  src="/images/about-standard.webp"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-background-10 md:bg-white">
        <div className="flex flex-col container pt-10 md:pt-16 pb-10">
          <p className="font-bold text-text-dark text-2xl md:text-3xl pb-6 text-center">پلتفرم OBS، راه جذاب رسیدن به یک تصمیم درست</p>
          <p className="text-medium md:text-lg text-center">
            شما با شرکت در شبیه‌سازی‌های شغلی و آموزشی، می‌تونین مسیر ارزشمند و جذابی از ترکیب آموختن در کنار آگاهی و تجربه رو تا موفقیت طی
            کنین. موفقیتی که برای شما ساخته شده، نه نسخه‌ی آماده‌ی دیگران.
          </p>
        </div>
      </div>
      <div className="bg-background-10 pb-0 md:pb-16 md:px-12">
        <div className="container flex flex-col md:flex-row">
          <div className="bg-background-50 rounded-[32px] flex-1 flex flex-col gap-12 items-center justify-center py-8 mb-10 md:mb-0">
            <img
              alt="obs platform"
              className="max-h-[300px]"
              src={`/images/${obsPlatformSelectedKey === '1' ? 'person-hi' : obsPlatformSelectedKey === '2' ? 'choose-simulator' : 'test-simulation'}.png`}
            />
            <Button to="/auth">همین الان ثبت نام کن!</Button>
          </div>
          <div className=" flex-col md:flex-row gap-8 pt-12 md:pb-20 relative -top-16 md:top-0 md:-right-7 flex-1">
            <Accordion
              hideIndicator
              hideNavigation
              accordionData={accordionData3}
              color="primary"
              contentClassName="!text-text-light-25 pr-12 text-medium"
              startContentClassName="md:size-[56px] font-bold md:text-3xl"
              titleClassName="!text-text-dark"
              onKeyChange={(newKey) => setObsPlatformSelectedKey(newKey)}
            />
          </div>
        </div>
      </div>
      {/* <div className="container py-10 md:py-16">
        <div className="mb-10">
          <p className="text-text-dark font-bold text-2xl pb-4 text-center">معرفی تیم مجموعه OBS</p>
          <p className="text-text text-xl leading-7 text-center">
            تیم شامل متخصصانی هست که با چالش های به روز کسب و کارها و نیروی کار جویای شغل مواجه بودن و با بهره گیری از دانش تخصصی کارآفرینی
            سازمانی و با هدف توسعه ی کسب و کارها و توسعه ی مهارتی این پلتفرم رو طراحی کردن. ما با شما هستیم تا به موفقیتی که آرزوش رو دارید
            برسید و مطمئنیم که با ما، قدم به قدم در این مسیر پیش خواهید رفت.
          </p>
        </div>
        <div className="w-full">
          {team.length && (
            <Swiper>
              {team.map((teamItem: any) => (
                <SwiperSlide key={teamItem.id}>
                  <MemberCard {...teamItem} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div> */}
      {/* <div className="bg-primary-100 mb-20">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 w-full gap-12 md:gap-8 md:items-center">
            <div className="col-span-1 md:col-span-2 overflow-hidden">
              <img
                src="/images/team.png"
                className="w-full h-full object-cover"
                alt="about us"
              />
            </div>
            <div className="col-span-1 md:col-span-3">
              <p className="text-white text-sm md:text-lg">پس بیاید با هم شروع کنیم و دنیای شغل‌های جذاب رو کشف کنیم.</p>
              <p className="text-white text-lg md:text-3xl font-bold mt-5 mb-8"> در OBS، جایی که هر کسی می‌تونه موفق بشه!</p>
              <Button
                className="bg-background-primary text-primary w-full md:w-fit"
                size="lg"
                to="/auth"
              >
                همین الان ثبت نام کن
              </Button>
            </div>
          </div>
        </div>
      </div> */}
    </section>
  )
}

export default Questions

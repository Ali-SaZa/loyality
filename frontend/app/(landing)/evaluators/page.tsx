'use client'

import { SwiperSlide } from 'swiper/react'

import Button from '@/components/formElements/Button'
import IntroHeader from '@/components/ui/IntroHeader'
import ImageWithDetailCard from '@/components/card/ImageWithDetailCard'
import Swiper from '@/components/ui/Swiper'
import Accordion from '@/components/ui/Accordion'

export default function Evaluators() {
  const accordionData = [
    {
      id: 1,
      key: '1',
      title: 'ارزیابی دقیق بر اساس عملکرد خودت',
      content: 'تکالیفی که ارائه دادی توسط ارزیاب بررسی میشه و ایرادهای احتمالی و نقاط قوتت مشخص میشه',
    },
    {
      id: 2,
      key: '2',
      title: 'امتیازدهی به مهارت ها',
      content:
        'برای هر کدوم از مهارت هایی که کسب کردی، ارزیاب امتیاز منحصر به فردی میده که روی مجموع امتیازات لازم برای کسب اون مهارت تاثیر مستقیم میذاره.',
    },
    {
      id: 3,
      key: '3',
      title: 'ارائه ی راهکار پیشرفت',
      content:
        'ارزیاب برای بهبود توانمندی ها و توسعه ی مهارت های شغلیت، راهکارهای آموزشی هدفمند ارائه میده تا بتونی خیلی دقیق مسیر رسیدن به تخصص شغلی مطلوب خودت رو طی کنی',
    },
  ]

  return (
    <section className="pt-16">
      <IntroHeader url="/images/evaluators-header.jpg">
        <div className="text-text-dark text-3xl md:text-4xl font-bold leading-[46px] md:leading-[56px]">
          مهارت های شغلی خودت رو با کمک
          <div className="inline-block relative mx-1">
            <div className="text-white relative z-40"> ارزیاب حرفه ای،</div>
            <div className="absolute -top-[10%] right-0 bg-primary w-full h-[120%] -rotate-1	z-30" />
          </div>
          ثابت کن
        </div>
        <div className="text-text-dark text-xl align-text-center mt-6 mb-9">
          اینجا میتونی بعد از گذروندن چالش ها و ماموریت هایی که توی هر شبیه سازی شغلی یا آموزشی واست چیدیم، درخواست ارزیابی بدی و یه سرپرست
          شغلی اینکاره، بهت بازخورد واقعی راجب عملکردت میده
        </div>
        <Button
          className="mt-6 md:mb-0 w-full md:w-fit"
          color="primary"
          size="lg"
        >
          خودتو به چالش بکش
        </Button>
      </IntroHeader>
      <div className="container py-12">
        <div className="text-center">
          <p className="text-text-dark leading-[32px] md:leading-[56px] text-lg md:text-3xl font-bold mb-6">
            ارزیابی یه سرپرست حرفه ای، چجوری میتونه بهت کمک کنه؟
          </p>
          <div className="flex flex-col items-center gap-5">
            <p className="text-sm md:text-lg leading-5 md:leading-7 text-center">
              هر شبیه ساز شغلی ای که میگذرونین، در کنار وظایف و چالش هایی که توی یک شغل خاص در یک سازمان خاص منتظرتونه، بهتون توی افزایش یک
              سری مهارت شغلی و اجتماعی مشخص کمک میکنه.
            </p>
            <p className="text-sm md:text-lg leading-5 md:leading-7 text-center">
              اینکه چقدر از پس این چالش ها بر اومدین و چه میزان توی هر مهارت رشد کردین، نیاز به نظر یه سرپرست اینکاره داره که در قالب
              ارزیاب، به عملکردتون امتیازدهی کنه و راهکارهای اختصاصی برای توسعه ی مهارت هاتون بده.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-12 md:gap-0 container mt-4 md:mt-12">
        <div className="rounded-xl bg-background-10 md:bg-white py-6 px-4 w-full flex items-center justify-center">
          <ImageWithDetailCard
            className="w-full"
            description="امتیازدهی ارزیاب به مهارت هات باعث میشه به مرور زمان با گذروندن هر شبیه ساز شغلی و یا آموزشی، امتیازت توی اون مهارت بیشتر و بیشتر بشه"
            imageClassName="w-[170px] h-[120px]"
            title="اثبات توانمندی ها"
            url="/images/evaluator-vector.png"
          />
        </div>
        <div className="rounded-xl bg-background-10 md:bg-white py-6 px-4 w-full flex items-center justify-center">
          <ImageWithDetailCard
            className="w-full"
            description="اینکه بدونی حرفه ای ها راجبت چه فکری میکنن، ایرادای کارت از نظر یه اینکاره چیاست و کدوم مهارت نقطه ی ضعف یا قدرتته، بهت واسه ادامه ی مسیر بیشتر کمک میکنه"
            imageClassName="w-[170px] h-[120px]"
            title="دریافت بازخورد"
            url="/images/evaluator-vector.png"
          />
        </div>
        <div className="rounded-xl bg-background-10 md:bg-white py-6 px-4 w-full flex items-center justify-center">
          <ImageWithDetailCard
            className="w-full"
            description="با شناخت نقاط ضعف و قوتت، میتونی یه استراتژی هدفمند و مشخص واسه ی افزایش مهارت های شغلی خودت ترسیم کنی"
            imageClassName="w-[170px] h-[120px]"
            title="توسعه ی مهارتی"
            url="/images/evaluator-vector.png"
          />
        </div>
      </div>
      <div className="w-full mb-20 md:mb-36 mt-16 md:mt-32 flex justify-center">
        <Button size="lg">خودتو به چالش بکش</Button>
      </div>
      <div className="container pb-24">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col items-center gap-3 md:gap-6">
            <p className="font-bold text-text-dark text-xl md:text-3xl leading-8 md:leading-10">ارزیابی چجوری انجام میشه؟</p>
            <p className="text-sm md:text-lg leading-5 md:leading-7 text-center">
              واسه ی شبیه سازی که انتخاب کردی، یه سرپرست شغلی بعنوان ارزیاب، به خروجی کاری که ارائه دادی بازخورد دقیقی میده و به تفکیک به
              مهارت هایی که توی اون شبیه سازی سنجیده میشده، امتیاز میده.
            </p>
          </div>
          <div className="bg-primary relative rounded-tl-3xl rounded-bl-3xl py-9 px-32 w-[90%] min-h-[376px] max-h-[376px] hidden md:block">
            <div className="mr-[220px]">
              <Accordion
                hideIndicator
                accordionData={accordionData}
              />
            </div>
            <img
              alt="phone mockup"
              className="absolute -top-14 right-6"
              height={600}
              src="/images/phone-evaluators.png"
              width={300}
            />
          </div>
          <div className="bg-primary rounded-2xl p-6 relative md:hidden">
            <Swiper color="secondary">
              {accordionData.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="flex flex-col items-center tgext-center gap-6 text-white">
                    <p className="font-bold leading-6">{item.title}</p>
                    <p className="text-sm leading-4 text-center">{item.content}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
      <div className="bg-background-50 pt-16 md:pb-32 pb-6">
        <div className="container">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col md:flex-row gap-16">
              <img
                alt="hand"
                className="flex-1"
                height={314}
                src="/images/evaluator-hands.png"
                width={491}
              />
              <div className="flex-1 flex items-center">
                <div className="flex flex-col gap-6">
                  <p className="text-text-dark font-bold text-lg md:text-3xl leading-8 md:leading-[56px] text-center md:text-right">
                    ارزیاب شغلی به نتایج منجر می شود
                  </p>
                  <p className="text-sm md:text-lg leading-5 md:leading-7 text-center md:text-right">
                    به برخی از نتایج ارزیابی که توسط ارزیاب های OBS شناسایی شده است نگاهی بیندازید.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-5 md:gap-16">
              <div className="border border-primary md:w-full border-dashed rounded-xl py-6 px-3 flex flex-col items-center justify-center gap-2 w-[270px]">
                <p className="text-4xl leading-[56px]">+65%</p>
                <p className="text-sm leading-6 text-text-dark">افزایش مهارت برنامه نویسی</p>
              </div>
              <div className="border border-primary md:w-full  border-dashed rounded-xl py-6 px-3 flex flex-col items-center justify-center gap-2 w-[270px]">
                <p className="text-4xl leading-[56px]">+38%</p>
                <p className="text-sm leading-6 text-text-dark">افزایش مهارت حل مساله</p>
              </div>
              <div className="border border-primary md:w-full  border-dashed rounded-xl py-6 px-3 flex flex-col items-center justify-center gap-2 w-[270px]">
                <p className="text-4xl leading-[56px]">+50%</p>
                <p className="text-sm leading-6 text-text-dark">افزایش بهره وری</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <CommentSection
        title="مورد اعتماد هزاران مشتری خوشحال"
        description="اینها داستان های مشتریان ما است که با استفاده از این سرویس با کمال میل به ما پیوسته اند."
      >
        <Swiper color="secondary">
          <SwiperSlide>{({ isActive }) => <CommentCard isActive={isActive} />}</SwiperSlide>
          <SwiperSlide>{({ isActive }) => <CommentCard isActive={isActive} />}</SwiperSlide>
          <SwiperSlide>{({ isActive }) => <CommentCard isActive={isActive} />}</SwiperSlide>
          <SwiperSlide>{({ isActive }) => <CommentCard isActive={isActive} />}</SwiperSlide>
          <SwiperSlide>{({ isActive }) => <CommentCard isActive={isActive} />}</SwiperSlide>
          <SwiperSlide>{({ isActive }) => <CommentCard isActive={isActive} />}</SwiperSlide>
        </Swiper>
      </CommentSection> */}
    </section>
  )
}

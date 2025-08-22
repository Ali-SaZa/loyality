'use client'
import { SwiperSlide } from 'swiper/react'
import { useEffect, useState } from 'react'

import Button from '@/components/formElements/Button'
import Header from '@/components/layouts/Header'
import BrandList from '@/components/ui/BrandList'
import Swiper from '@/components/ui/Swiper'
import SimulatorCard from '@/components/card/SimulatorCard'
import useWindowSize from '@/hooks/useWindowSize'
import CommentCard from '@/components/card/CommentCard'
import ImageWithDetailCard from '@/components/card/ImageWithDetailCard'
import CommentSection from '@/components/ui/CommentSection'
import Accordion from '@/components/ui/Accordion'
import useLoading from '@/hooks/useLoading'
import { GET_ALL_SIMULATIONS } from '@/services/simulations'
import { GET_INDEX_PAGE_DATA } from '@/services/dashboard'

export default function Home() {
  const { width } = useWindowSize()
  const { setLoading } = useLoading()

  const [comments, setComments] = useState<any[]>([])
  const [simulators, setSimulators] = useState<any[]>([])
  const [startSuccessSelectedKey, setStartSuccessSelectedKey] = useState('1')

  const accordionData2 = [
    {
      id: 1,
      key: '1',
      title: 'تحلیل مهارت ها و توانمندی های شما',
      content:
        'اینجا میتونی بعد از گذروندن چالش ها و ماموریت هایی که توی هر شبیه سازی شغلی یا آموزشی واست چیدیم، درخواست ارزیابی بدی و یه سرپرست شغلی اینکاره، بهت بازخورد واقعی راجب عملکردت میده',
    },
    {
      id: 2,
      key: '2',
      title: 'دریافت گواهی نامه معتبر مجازی',
      content:
        'دیدی هر جا میری ازت تجربه ی کاری میخوان؟ بدون اینکه از خودشون بپرسن یه جوون دانشجو یا تازه فارغ التحصیل شده از مدرسه یا دانشگاه، کی میتونسته بره تجربه کسب کنه؟ خب جوابش همینجاست، میتونی تجربه ی کار کردن توی شرکت های بزرگ رو در قالب تجربه ی شبیه سازی شده کسب کنی و به کارفرماها ثابت کنی امتحانت رو پس دادی، میدونی چخبره!',
    },
    {
      id: 3,
      key: '3',
      title: 'امکان جذب نیرو توسط کسب و کارها',
      content:
        'خب تو داری شبیه سازی شغلی یک کسب و کار رو میگذرونی، از پس چالش هاش هم براومدی و تونستی خیلی خوب شایستگی ها و توانمندی های خودت رو ثابت کنی. پس خیلی واضحه که وقتی از این فرصت به بهترین نحو استفاده می کنی، مدیرهایی که تشنه ی پیدا کردن یه نیروی توانمند و اینکاره هستن، با دیدن عملکردت بیان سراغت. پس اینجا رو یه سکوی پرتاب بدون!',
    },
  ]

  const fetchSimulations = async () => {
    try {
      setLoading(true)
      const params = {
        page: 1,
        pageSize: 8,
      }
      const response = await GET_ALL_SIMULATIONS(params)

      setSimulators(response.data.data)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchIndexPageData = async () => {
    try {
      setLoading(true)
      const response = await GET_INDEX_PAGE_DATA()

      setComments(response.data.comments)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIndexPageData()
    fetchSimulations()
  }, [])

  return (
    <section>
      <Header />
      <div className="w-full py-8 container hidden flex-col relative md:flex">
        <div className="absolute h-[70%] bottom-0 right-0 w-28 lg:w-48 xl:w-96 bg-gradient-to-l from-white via-white to-transparent opacity-100 z-10" />
        <div className="absolute h-[70%] bottom-0 left-0 w-28 lg:w-48 xl:w-96 bg-gradient-to-r from-white via-white to-transparent opacity-100 z-10" />
        {/*<TitleWithDivider title="کسب و کارهایی که میتونی کارکردن باهاشون رو اینجا تجربه کنی" />*/}
        <div className="flex items-center gap-4">
          <p className="text-lg md:text-2xl text-text-dark text-center text-nowrap">کسب و کارهایی که میتونی کارکردن باهاشون رو تجربه کنی</p>
          <div className="w-full border border-dashed" />
          <div>
            <Button
              color="default"
              size={width < 768 ? 'sm' : 'md'}
              to="/organizations"
            >
              مشاهده همه
            </Button>
          </div>
        </div>
        <BrandList />
      </div>
      {/* <div className="p-16 hidden md:flex items-center bg-[url('/images/services.jpg')] bg-cover bg-no-repeat bg-center relative">
        <div className="absolute right-0 left-0 top-0 bottom-0 bg-[#141b39] opacity-80"></div>
        <div className="z-10 flex items-center justify-between w-full h-full">
          <ObsLogo
            text="خروجی تجربیات ارزشمندت در کنار OBS"
            iconSize={164}
            className="text-white !text-3xl"
          />
          <div className="grid grid-cols-3 gap-4 h-full">
            <ServicesCard
              icon={<SearchAltIcon className="size-[70px]" />}
              text="مهارت شغلی واقعی"
            />
            <ServicesCard
              icon={<DiplomaIcon className="size-[70px]" />}
              text="اثبات شایستگی"
            />
            <ServicesCard
              icon={<ChatArrowGrowIcon className="size-[70px]" />}
              text="کشف ضعف ها و قوت ها"
            />
          </div>
        </div>
      </div> */}
      <div className="flex flex-col gap-8 py-12 container">
        <div className="flex items-center gap-4">
          <p className="text-lg md:text-2xl text-text-dark text-center text-nowrap">شبیه ساز های شغلی</p>
          <div className="w-full border border-dashed" />
          <div>
            <Button
              color="default"
              size={width < 768 ? 'sm' : 'md'}
              to="/simulators"
            >
              مشاهده همه
            </Button>
          </div>
        </div>
        <div className="w-full">
          {!!simulators.length && (
            <Swiper>
              {simulators.map((simulator: any) => (
                <SwiperSlide key={simulator!.id}>
                  <SimulatorCard simulator={simulator} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-12 container gap-8 md:gap-16">
        <div className="flex flex-col items-center justify-center">
          <p className="text-text-dark text-2xl pb-4 text-center hidden md:block">چیزی که کنار هم تجربه می کنیم.</p>
          <p className="font-bold text-text-dark text-lg md:text-3xl leading-8 text-center">
            کشف راز شغل های جذاب، در دل کسب و کارهای بزرگ
          </p>
          {/* <p className="text-lg text-center">
            ابزارهای متفاوت را کنار بگذارید و پلتفرمی را انتخاب کنید که با ارائه پشتیبانی مناسب به افراد مناسب در زمان مناسب با مقیاس، سرعت
            و دقت مورد نیاز سازمان شما، به طور هوشمندانه با نیازهای سازمان شما سازگاری دارد.
          </p> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-12 md:gap-0">
          <ImageWithDetailCard
            className="w-[280px] mx-auto lg:mx-0"
            description="قراره تجربه ی یک روز کار کردن توی یک سمت شغلی توی یک شرکت جذاب رو کسب کنی؛ اینکه در روز با چه چالش هایی مواجه میشی و چه توقعاتی ازت وجود داره."
            imageClassName="w-[280px] h-[280px]"
            title="تجربه‌ی اونچه شرکت ها توقع دارن"
            url="/images/organization-index.webp"
          />
          <ImageWithDetailCard
            className="w-[280px] mx-auto"
            description="قراره با این تجربیات متنوع، خودت بدونی و تشخیص بدی برای چه شغلی مناسب تری، با چه چالش هایی کنار میای و چه چالش هایی واست جذاب نیست؛ یک استعدادیابی واقعی که کلیدش دست خودته."
            imageClassName="w-[280px] h-[280px]"
            title="تجربه‌ی انتخاب‌هایی که نمیدونستی"
            url="/images/choice-index.webp"
          />
          <ImageWithDetailCard
            className="w-[280px] mx-auto lg:mx-0 lg:mr-auto"
            description="قراره با اثبات توانمندی ها و مهارتات بر اساس خروجی های سرپرست هر شغل، ثابت کنی آینده برای تو و در دست تو خواهد بود، کافیه مهارت های شغلی ای که الآن میدونی دیگه به چه دردی میخورن رو کسب کنی."
            imageClassName="w-[280px] h-[280px]"
            title=" تجربه‌ی آینده‌ی جذاب‌تر"
            url="/images/future-index.webp"
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-4/6 bg-background-primary container pt-10 lg:pt-16 pb-10 lg:pb-32">
          <div className="flex flex-col gap-6 lg:gap-14 ">
            <div className="flex flex-col gap-6 text-center lg:text-right">
              <p className="text-2xl lg:text-3xl text-text-dark font-bold">چرا باید راه موفقیتت رو با OBS شروع کنی؟</p>
              <p className="text-medium lg:text-lg">
                پلتفرمی که می خواد بهت حق انتخاب بده، واست فضایی برای تجربه کردن و سنجیدن توانمندی ها و علایقت ایجاد کنه، واقعیت بازار رو
                نشون بده و دنبال تحمیل رویاهای دروغین و رویا فروشی نیست؛ پرسیدن داره؟ ولی بیا بیشتر راجبش صحبت کنیم.
              </p>
            </div>
            <img
              key={startSuccessSelectedKey}
              alt="start success"
              className="w-full h-full lg:hidden rounded-xl"
              src={`/images/${startSuccessSelectedKey === '1' ? 'start-success-1' : startSuccessSelectedKey === '2' ? 'start-success-2' : 'start-success-3'}.webp`}
            />
            <Accordion
              hideIndicator
              hideNavigation
              accordionData={accordionData2}
              color="primary"
              contentClassName="!text-text-light-25 pr-12"
              titleClassName="!text-text-dark"
              onKeyChange={(newKey) => setStartSuccessSelectedKey(newKey)}
            />
          </div>
        </div>
        <div className="lg:w-2/6 hidden lg:block">
          <img
            alt="start success"
            className="w-full h-[767px]"
            src={`/images/${startSuccessSelectedKey === '1' ? 'start-success-1' : startSuccessSelectedKey === '2' ? 'start-success-2' : 'start-success-3'}.webp`}
          />
        </div>
      </div>
      {/* <div className="bg-secondary">
        <div className="container flex flex-col md:flex-row">
          <div className="flex-1 flex flex-col gap-6 py-10 md:py-24 text-center md:text-right">
            <p className="text-text-dark text-2xl md:text-3xl font-bold">بیا واست چند تا شبیه ساز مناسب خودت پیدا کنیم</p>
            <p className="text-medium md:text-lg">
              با جواب دادن به این سوالات، میتونیم شبیه سازهایی که بیشتر به سوابق و عملکردت مربوط هستن رو بهت معرفی کنیم.
            </p>
            <Button className="mx-auto md:mx-0 md:w-fit">شروع ارزیابی</Button>
          </div>
          <div className="flex-1 relative overflow-y-hidden">
            <img
              width={800}
              height={408}
              src="/images/phone.png"
              alt="phone"
              className="pr-12 hidden md:block absolute bottom-0 w-[800px] h-[408px]"
            />
            <img
              width={340}
              height={570}
              src="/images/phone-responsive.png"
              alt="phone"
              className="mx-auto block md:hidden w-[340px] h-[570px]"
            />
          </div>
        </div>
      </div> */}
      {comments && !!comments.length && (
        <CommentSection
          description="شما مشتری ما نیستین، هم مسیرما هستین"
          title="OBS قدم اول رسیدن به آرزوها"
        >
          <Swiper color="secondary">
            {comments.map((comment, index) => (
              <SwiperSlide key={index}>
                {({ isActive }) => (
                  <CommentCard
                    comment={comment}
                    isActive={isActive}
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </CommentSection>
      )}
    </section>
  )
}

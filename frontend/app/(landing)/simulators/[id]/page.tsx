'use client'
import { Tab, Tabs } from '@nextui-org/tabs'
import { useRouter } from 'next/navigation'
import React, { use, useEffect, useState } from 'react'
import { SwiperSlide } from 'swiper/react'
import Link from 'next/link'

import Button from '@/components/formElements/Button'
import Chart from '@/components/utils/Chart'
import Swiper from '@/components/ui/Swiper'
import VideoPlayer from '@/components/media/VideoPlayer'
import CheckBoxIcon from '@/components/icons/CheckBoxIcon'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon'
import StarRatingIcon from '@/components/icons/StarRatingIcon'
import CommentCard from '@/components/card/CommentCard'
import CommentSection from '@/components/ui/CommentSection'
import Hashtag from '@/components/ui/Hashtag'
import IntroHeader from '@/components/ui/IntroHeader'
import HtmlRenderer from '@/components/utils/HtmlRenderer'
import UserVerticalStepper from '@/components/utils/UserVerticalStepper'
import { fileAddress, generateRandomColor, isEmptyObject } from '@/helpers'
import useGlobal from '@/hooks/useGlobal'
import useLoading from '@/hooks/useLoading'
import useWindowSize from '@/hooks/useWindowSize'
import { GET_SIMULATION_BY_ID } from '@/services/simulations'
import { GET_ALL_TASKS_BY_SIMULATION_ID_FOR_VISITORS } from '@/services/tasks'
import { GET_SIMULATION_COMMENTS } from '@/services/simulationUser'
import EmptyListPlaceholder from '@/components/utils/EmptyListPlaceholder'

const SimulatorDetail = ({ params: promisedParams }: PropsWithParams) => {
  const params = use(promisedParams)
  const { data } = useGlobal()
  const { width } = useWindowSize()
  const { setLoading } = useLoading()
  const router = useRouter()

  const [comments, setComments] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [simulator, setSimulator] = useState<any>()
  const [tasks, setTasks] = useState<
    {
      title: string
      difficultyLevel: string
      estimatedHours: number
      [key: string]: any
    }[]
  >([])

  const getSimulator = async () => {
    setLoading(true)
    const response = await GET_SIMULATION_BY_ID(params.id)

    setSimulator(response.data)

    const skillsWithColors = response.data.skills.map((skill: any) => ({
      ...skill,
      colorCode: generateRandomColor(),
    }))

    setChartData(skillsWithColors)
    setLoading(false)
  }

  const getTasks = async () => {
    setLoading(true)
    const response = await GET_ALL_TASKS_BY_SIMULATION_ID_FOR_VISITORS(params.id)

    setTasks(response.data.jobSimulationTasks)
    setLoading(false)
  }

  const getComments = async () => {
    setLoading(true)
    const response = await GET_SIMULATION_COMMENTS(params.id)

    setComments(response.data.data)
    setLoading(false)
  }

  useEffect(() => {
    getSimulator()
    getTasks()
    getComments()
  }, [])

  return (
    <section className="pt-36 md:pt-0">
      {width >= 768 && (
        <IntroHeader
          className="!text-right"
          customGradient="bg-[linear-gradient(180deg,rgba(106,106,106,0.5)0%,rgba(0,0,0,0.8)100%)]"
          url={fileAddress((simulator?.bannerId !== '000000000000000000000000' && simulator?.bannerId) || simulator?.imageId)}
        >
          <div className="flex justify-between items-end">
            <div className="flex gap-4">
              <Link
                className="bg-white rounded-full size-[120px] min-h-[120px] min-w-[120px] p-4 flex items-center justify-center border-4 border-primary"
                href={`/organizations/${simulator?.organizationId}`}
              >
                <img
                  alt="business logo"
                  className="!max-w-[75px]"
                  src={fileAddress(simulator?.organizationLogoId)}
                />
              </Link>
              <div className="flex flex-col justify-between text-white">
                <p className="font-bold text-2xl md:text-3xl leading-[32px] md:leading-[32px]">{simulator?.title}</p>
                <div className="flex items-center gap-6">
                  <Link
                    className="text-medium md:text-lg leading-6 md:leading-7 text-nowrap"
                    href={`/organizations/${simulator?.organizationId}`}
                  >
                    {simulator?.organizationName}
                  </Link>
                  {!!simulator?.hashtags?.length && (
                    <div className="flex items-center flex-wrap gap-2">
                      {simulator.hashtags.map((hashtag: { hashtagId: string; title: string }) => (
                        <Hashtag
                          key={hashtag.hashtagId}
                          className="bg-primary text-white border-white"
                          text={hashtag.title}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {simulator?.hasEmployment && (
                    <div className="rounded-md py-1 px-2 flex items-center gap-2 bg-success">
                      <CheckBoxIcon className="size-[18px] text-white" />
                      <p className="text-white text-xs">جذب نیرو دارد</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="bg-primary-25 size-[6px] rounded-full" />
                    <p className="text-xs text-white">{data.difficultyLevels.find((dl) => dl.code === simulator?.difficultyLevel)?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary-25 size-[6px] rounded-full" />
                    <p className="text-xs text-white">{simulator?.totalTasksEstimatedHours} ساعت</p>
                  </div>
                </div>
              </div>
            </div>
            <Button
              className="px-16"
              to={`/start-simulator/${simulator?.id}`}
            >
              شروع شبیه ساز
            </Button>
          </div>
        </IntroHeader>
      )}
      <div className="container md:hidden my-4 flex flex-col gap-4 relative">
        <Button
          iconOnly
          className="!rounded-full border-1 absolute -top-20 right-4"
          color="default"
          variant="bordered"
          onClick={() => router.back()}
        >
          <ChevronRightIcon className="size-4 text-text" />
        </Button>
        <div className="rounded-xl bg-background-10 p-4 flex flex-col relative">
          <Link
            className="bg-white shadow-medium rounded-full size-[120px] p-4 flex items-center justify-center border-4 border-primary absolute -top-20 left-1/2 transform -translate-x-1/2"
            href={`/organizations/${simulator?.organizationId}`}
          >
            <img
              alt="business logo"
              className="!max-w-[75px]"
              src={fileAddress(simulator?.organizationLogoId)}
            />
          </Link>
          <div className="flex justify-between items-center">
            {!isEmptyObject(simulator?.rate ?? {}) && (
              <Button
                className="absolute top-3 right-3 font-normal"
                color="default"
                iconEnd={<StarRatingIcon className="size-3" />}
                size="sm"
              >
                {(simulator.rate.totalRate / simulator.rate.count).toFixed(1)}
              </Button>
            )}
            {/* <Button
              iconOnly
              size="sm"
              color="default"
            >
              <BookmarkIcon className="size-4 text-[#74757E]" />
            </Button> */}
          </div>
          <div className="flex flex-col gap-4 pt-10">
            <div className="flex flex-col items-center gap-3">
              <p className="text-text-dark font-semibold">{simulator?.title}</p>
              <Link
                className="text-text-light-25 font-bold"
                href={`/organizations/${simulator?.organizationId}`}
              >
                {simulator?.organizationName}
              </Link>
            </div>
            {!!simulator?.hashtags?.length && (
              <div className="flex items-center flex-wrap gap-2">
                {simulator.hashtags.map((hashtag: { hashtagId: string; title: string }) => (
                  <Hashtag
                    key={hashtag.hashtagId}
                    className="bg-primary text-white border-white"
                    text={hashtag.title}
                  />
                ))}
              </div>
            )}
            <div className="w-full bg-background-70 h-[1px] rounded-full" />
            <div className="flex items-center justify-between w-full">
              {simulator?.hasEmployment && (
                <div className="rounded-md py-1 px-2 flex items-center gap-2 bg-[#E9F5F1]">
                  <CheckBoxIcon className="size-[18px] text-success" />
                  <p className="text-success text-xs">جذب نیرو دارد</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="bg-primary size-[6px] rounded-full" />
                <p className="text-xs text-text-light-25">
                  {data.difficultyLevels.find((dl) => dl.code === simulator?.difficultyLevel)?.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary size-[6px] rounded-full" />
                <p className="text-xs text-text-light-25">{simulator?.totalTasksEstimatedHours} ساعت</p>
              </div>
            </div>
          </div>
        </div>
        <Button
          fullWidth
          size="lg"
          to={`/start-simulator/${simulator?.id}`}
        >
          شروع شبیه ساز
        </Button>
      </div>
      <Tabs
        aria-label="Options"
        classNames={{
          base: `w-full md:bg-background-50 md:py-1 md:px-[180px] md:shadow-md ${width < 768 && 'container'}`,
          tabList: 'md:rounded-none relative w-full md:w-fit',
          tab: 'md:px-8 md:py-6',
          tabContent: 'group-data-[selected=true]:text-white',
        }}
        color="secondary"
        disabledKeys={simulator?.hasFeedback ? [] : ['feedbacks']}
        radius="sm"
        size="lg"
        variant={width < 768 ? 'solid' : 'light'}
      >
        <Tab
          key="description"
          title="توضیحات"
        >
          <div className="container py-4 md:py-10">
            <div className="bg-background-20 p-6 rounded-xl flex flex-col gap-5 mb-8 md:mb-16 overflow-auto">
              <div className="mx-auto">
                <p className="font-bold text-lg leading-7 text-text-dark">توضیحات</p>
              </div>
              <HtmlRenderer htmlContent={simulator?.description} />
            </div>
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-8 md:mb-16">
              <div className="bg-background-20 flex flex-col gap-5 grow rounded-xl py-6 px-8">
                <p className="text-text-dark text-xl font-medium mx-auto"> وظایف اجرایی شبیه ساز</p>
                <UserVerticalStepper
                  currentStep={tasks.length + 1}
                  stepsDetail={tasks}
                />
              </div>
            </div>
            {!!simulator?.introductionVideo?.videoId && (
              <div className="bg-background-20 mb-8 md:mb-16 rounded-xl py-6 px-8 flex flex-col gap-4">
                <VideoPlayer videoId={simulator?.introductionVideo?.videoId} />
                <p className="text-text-dark text-xl font-medium text-center">{simulator?.introductionVideo?.title}</p>
                <p className="text-justify text-text-light-25">{simulator?.introductionVideo?.description}</p>
              </div>
            )}
          </div>
        </Tab>
        <Tab
          key="achievements"
          title="دستاورد ها"
        >
          <div className="container py-4 md:py-10">
            <div className="bg-background-20 py-6 px-8 rounded-xl flex flex-col gap-4 mb-8 md:mb-16">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  alt="achievement"
                  className="mx-auto"
                  height={150}
                  src="/images/achievement.webp"
                  width={194}
                />
                <div className="flex flex-col gap-6">
                  <p className="text-text-dark font-bold md:font-medium text-center md:text-start text-xl">دستاورد ها</p>
                  <p className="text-text-light text-justify hidden md:block">
                    شما با گذروندن هر شبیه ساز، یک قدم به رسیدن به نسخه‌ی مطلوب و قوی خودتون نزدیک‌تر میشین. این مسیر بهتون کمک میکنه تا
                    آموزش عمیق رو با تجربه کردن لمس کنین و برای شروع یک مسیر شغلی و یا انجام حرفه‌ای یک فرآیند شغلی آماده‌تر از همیشه بشین.
                    در کنار آموختن تجربی، هدفمند و هوشمندانه، دستاوردهای زیر هم، می‌تونه به موندگارتر شدن این تجربه‌ی ارزشمندتون کمک کنه.
                  </p>
                </div>
              </div>
              <div
                className={`grid gap-6 md:gap-12 grid-cols-1 ${simulator?.hasOfficialCertificate ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}
              >
                <div className="bg-white rounded-xl py-7 px-5 flex flex-col items-center gap-4">
                  <div className="size-[150px] rounded-full bg-background-50 p-[10px] flex items-center justify-center">
                    <img
                      alt="achievement"
                      height={80}
                      src="/images/achievement2.png"
                      width={116}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <p className="font-bold text-text-dark">گواهی نامه حضور در شبیه ساز</p>
                    <p className="text-text-light-25 text-center text-sm">
                      شما با شرکت توی هر شبیه ساز، گواهی نامه‌ای برای ثبت تجربه‌ی ارزشمندی که کسب کردین رو روی پنل کاربری خودتون دریافت
                      خواهید کرد.
                    </p>
                  </div>
                </div>
                {simulator?.hasOfficialCertificate && (
                  <div className="bg-white rounded-xl py-7 px-5 flex flex-col items-center gap-4">
                    <div className="size-[150px] rounded-full bg-background-50 p-[10px] flex items-center justify-center">
                      <img
                        alt="achievement"
                        height={80}
                        src="/images/achievement3.png"
                        width={116}
                      />
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <p className="font-bold text-text-dark">مدرک کار آموزی مجازی</p>
                      <p className="text-text-light-25 text-center text-sm">
                        میتونین مدرکی جهت تایید گذروندن دوره کارآموزی مجازی از طرف شرکت میزبان دریافت کنین
                      </p>
                    </div>
                  </div>
                )}
                <div className="bg-white rounded-xl py-7 px-5 flex flex-col items-center gap-4">
                  <div className="size-[150px] rounded-full bg-background-50 p-[10px] flex items-center justify-center">
                    <img
                      alt="achievement"
                      height={80}
                      src="/images/achievement1.png"
                      width={116}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <p className="font-bold text-text-dark">سنجش مهارت‌های شما</p>
                    <p className="text-text-light-25 text-center text-sm">
                      برای سنجش عمیق‌تر مهارت‌های خودتون، می‌تونید درخواست مدرک کارآموزی بدید تا علاوه بر دریافت مدرک پیشنهادهای یک متخصص و
                      صاحب نظر در این حوزه‌ی کاری، به عنوان سرپرست کارآموزی خودتون استفاده کنید.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-background-20 py-6 px-8 rounded-xl flex flex-col gap-4 mb-8 md:mb-16">
              <div className="flex flex-col gap-4">
                <p className="font-medium text-xl text-text-dark">مهارت هایی که کسب می کنید.</p>
                <p className="text-text-light-25 text-sm">میتوانید این مهارت هارا ارتقا دهید</p>
              </div>
              <div className="flex justify-between py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 ">
                  {chartData?.map((skill: any, index) => (
                    <div
                      key={skill.skillId + index}
                      className="flex gap-3"
                    >
                      <div
                        className="size-2 min-w-2 min-h-2 rounded-full mt-[6px]"
                        style={{ backgroundColor: skill.colorCode }}
                      />
                      <div className="flex flex-col gap-1">
                        <p className="text-text-dark text-sm">{skill.skillTitle}</p>
                        <p className="text-xs">{skill.percent}%</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="size-[154px] md:size-[192px]">
                  <Chart
                    chartData={chartData?.map((skill: any) => skill.percent)}
                    colors={chartData?.map((skill: any) => skill.colorCode)}
                    labels={chartData?.map((skill: any) => skill.skillTitle)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Tab>
        <Tab
          key="feedbacks"
          title="بازخورد ها"
        >
          {comments?.length ? (
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
          ) : (
            <EmptyListPlaceholder
              description="تا کنون بازخوردی برای این شبیه ساز ثبت نشده است."
              title="بازخوردی یافت نشد"
            />
          )}
        </Tab>
      </Tabs>
    </section>
  )
}

export default SimulatorDetail

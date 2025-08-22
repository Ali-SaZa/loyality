'use client'
import { useDisclosure } from '@nextui-org/modal'
import { CircularProgress } from '@nextui-org/progress'
import { Tab, Tabs } from '@nextui-org/tabs'
import React, { use, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import AudioPlayer from '@/components/media/AudioPlayer'
import Button from '@/components/formElements/Button'
import Chart from '@/components/utils/Chart'
import Modal from '@/components/modals/Modal'
import CommentsIcon from '@/components/icons/CommentsIcon'
import PlayIcon from '@/components/icons/PlayIcon'
import ReviewRateModal from '@/components/modals/ReviewRateModal'
import AccordionSection from '@/components/ui/AccordionSection'
import AchievementCard from '@/components/card/AchievementCard'
import RatingProgressCard from '@/components/card/RatingProgressCard'
import HtmlRenderer from '@/components/utils/HtmlRenderer'
import UserVerticalStepper from '@/components/utils/UserVerticalStepper'
import { fileAddress, generateRandomColor, handleDownloadPdf, truncateText } from '@/helpers'
import useGlobal from '@/hooks/useGlobal'
import useLoading from '@/hooks/useLoading'
import { GET_SIMULATION_BY_ID } from '@/services/simulations'
import { GET_USER_SIMULATION_BY_ID } from '@/services/simulationUser'
import { GET_ALL_TASKS_BY_SIMULATION_ID_FOR_LEARNERS } from '@/services/tasks'
import Alert from '@/components/utils/Alert'
import CommentModal from '@/components/modals/CommentModal'
import Participation from '@/components/certificate/participation'
import useAuth from '@/hooks/useAuth'
import Completion from '@/components/certificate/completion'

const SimulatorDetails = ({ params: promisedParams }: PropsWithParams) => {
  const params = use(promisedParams)
  const router = useRouter()
  const { isOpen, onOpenChange, onOpen } = useDisclosure()
  const { setLoading } = useLoading()
  const { setData } = useGlobal()
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState<string | number | null>('info')
  const [userWantsEvaluator, setUserWantsEvaluator] = useState(false)
  const [isOpenReviewRateModal, setIsOpenReviewRateModal] = useState(false)
  const [isOpenCommentModal, setIsOpenCommentModal] = useState(false)
  const [chartData, setChartData] = useState<any[]>([])
  const [simulatorDetail, setSimulatorDetail] = useState<any>(null)
  const [simulator, setSimulator] = useState<any>(null)
  const [tasks, setTasks] = useState<
    {
      title: string
      difficultyLevel: string
      estimatedHours: number
      [key: string]: any
    }[]
  >([])

  // استفاده از useRef برای ذخیره مقدار قبلی
  const prevIsOpen = useRef(isOpenReviewRateModal)

  useEffect(() => {
    // بررسی تغییر از true به false
    if (prevIsOpen.current && !isOpenReviewRateModal) {
      setIsOpenCommentModal(true)
    }

    // به روز رسانی prevIsOpen برای تغییرات بعدی
    prevIsOpen.current = isOpenReviewRateModal
  }, [isOpenReviewRateModal])

  const getSimulatorDetail = async () => {
    try {
      setLoading(true)
      const response = await GET_USER_SIMULATION_BY_ID(params.id)

      setSimulatorDetail(response.data)
      setUserWantsEvaluator(response?.data?.evaluation?.userWantsEvaluator)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const getSimulator = async () => {
    setLoading(true)
    const response = await GET_SIMULATION_BY_ID(simulatorDetail?.jobSimulationId)

    setData('navbar', { title: response.data.title })
    setSimulator(response.data)
    const skillsWithColors = response.data?.skills?.map((skill: any) => ({
      ...skill,
      colorCode: generateRandomColor(),
    }))

    setChartData(skillsWithColors)
    setLoading(false)
  }

  const getTasks = async () => {
    setLoading(true)
    const response = await GET_ALL_TASKS_BY_SIMULATION_ID_FOR_LEARNERS(simulatorDetail?.jobSimulationId)

    setTasks(response.data.jobSimulationTasks)
    setLoading(false)
  }

  useEffect(() => {
    getSimulatorDetail()
  }, [])

  useEffect(() => {
    if (simulatorDetail?.jobSimulationId) {
      getSimulator()
      getTasks()
    }
  }, [simulatorDetail])

  const totalScore = useMemo(() => {
    return (
      Math.ceil(
        simulatorDetail?.evaluation?.skills?.reduce((total: number, item: any) => total + item.score, 0) /
          simulatorDetail?.evaluation?.skills?.length
      ) || 0
    )
  }, [simulatorDetail])

  const handleUserWantsEvaluator = () => {
    return router.push(`/payment?jobSimulationUserId=${params.id}`)
  }

  const simulatorHasEvaluation = useMemo(() => {
    return simulator?.hasEvaluation
  }, [simulator])

  const evaluationStatus = useMemo(() => {
    return simulatorDetail?.evaluation?.status
  }, [simulatorDetail])

  const evaluationRequestedNoEvaluator = useMemo(() => {
    return !!evaluationStatus && (evaluationStatus === 'JSEUS_Pending' || evaluationStatus === 'JSEUS_Unspecified')
  }, [simulatorDetail, userWantsEvaluator])

  const evaluationInProgress = useMemo(() => {
    return !!evaluationStatus && evaluationStatus === 'JSEUS_InProgress'
  }, [simulatorDetail, userWantsEvaluator])

  const userHasEvaluator = useMemo(() => {
    return !!evaluationStatus && evaluationStatus === 'JSEUS_Published'
  }, [simulatorDetail, userWantsEvaluator])

  useEffect(() => {
    if (simulatorHasEvaluation && !userWantsEvaluator) {
      onOpen()
    }
  }, [simulatorHasEvaluation, userWantsEvaluator])

  return (
    <>
      <section className="w-full flex flex-col md:gap-6 relative">
        <div className="absolute left-0 rounded-xl w-full items-center justify-end bg-white px-4 py-2 hidden lg:flex min-h-[56px]">
          {simulatorHasEvaluation &&
            (!evaluationStatus ? (
              <Button
                iconStart={<CommentsIcon />}
                onClick={handleUserWantsEvaluator}
              >
                درخواست ارزیابی
              </Button>
            ) : (
              userHasEvaluator && (
                <Button
                  iconStart={<CommentsIcon />}
                  to={`/user/simulators/${params.id}/talk`}
                >
                  گفتگو با ارزیاب
                </Button>
              )
            ))}
        </div>
        {simulatorHasEvaluation &&
          (!evaluationStatus ? (
            <Button
              fullWidth
              className="lg:hidden mb-5"
              iconStart={<CommentsIcon />}
              onClick={handleUserWantsEvaluator}
            >
              درخواست ارزیابی
            </Button>
          ) : (
            userHasEvaluator && (
              <Button
                fullWidth
                className="lg:hidden mb-5"
                iconStart={<CommentsIcon />}
                to={`/user/simulators/${params.id}/talk`}
              >
                گفتگو با ارزیاب
              </Button>
            )
          ))}
        <Tabs
          aria-label="Options"
          classNames={{
            base: 'w-full lg:w-fit',
            panel: 'mt-5 lg:mt-0 p-0',
            tabList: 'bg-white py-2 px-4 lg:!rounded-l-none w-full lg:w-fit',
            tab: 'data-[selected=true]:bg-secondary lg:px-10',
            tabContent: 'group-data-[selected=true]:text-white',
          }}
          disabledKeys={!userHasEvaluator ? ['Evaluation', 'skills'] : []}
          selectedKey={activeTab}
          size="lg"
          onSelectionChange={setActiveTab}
        >
          <Tab
            key="info"
            title="اطلاعات کلی"
          >
            {evaluationRequestedNoEvaluator && (
              <div className="mb-4 md:mb-0">
                <Alert title="درخواست ارزیابی شما در حال بررسی است." />
              </div>
            )}
            {evaluationInProgress && (
              <div className="mb-4 md:mb-0">
                <Alert
                  color="success"
                  title="منتظر ارزیابی ماموریت‌هات بمون."
                />
              </div>
            )}
            <div className="md:py-5 flex flex-col gap-5 md:gap-9">
              <div className="flex flex-col lg:flex-row justify-between gap-5 lg:gap-9">
                <AccordionSection
                  defaultExpanded
                  title="مراحل اجرایی"
                >
                  <UserVerticalStepper
                    currentStep={tasks.length + 1}
                    stepsDetail={tasks}
                  />
                </AccordionSection>
                <AccordionSection
                  defaultExpanded
                  title="مهارت های کسب شده"
                >
                  <div className="flex justify-between py-4">
                    <div className="flex flex-col gap-3">
                      {!!chartData?.length &&
                        chartData?.map((skill: any, index: number) => (
                          <div
                            key={skill ? skill.skillId + index : index}
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
                </AccordionSection>
              </div>
              <AccordionSection
                defaultExpanded
                title="دستاورد ها"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 ${simulator?.hasOfficialCertificate ? 'xl:grid-cols-3' : 'xl:grid-cols-2'} gap-4 xl:gap-12`}
                >
                  <AchievementCard
                    buttonText="دریافت گواهی نامه"
                    description="شما با شرکت توی هر شبیه ساز، گواهی نامه‌ای برای ثبت تجربه‌ی ارزشمندی که کسب کردین رو روی پنل کاربری خودتون دریافت
                      خواهید کرد."
                    imageUrl="/images/achievement2.png"
                    title="گواهی نامه حضور در شبیه ساز"
                    onClick={() => {
                      if (!user?.nationalCode) {
                        return toast(() => (
                          <div className="flex items-center gap-2">
                            <p>ابتدا پروفایل خود را کامل کنید</p>
                            <Button
                              size="sm"
                              to="/auth/profile"
                              variant="light"
                            >
                              تکمیل پروفایل
                            </Button>
                          </div>
                        ))
                      }
                      setIsOpenReviewRateModal(true)
                    }}
                  />
                  {simulator?.hasOfficialCertificate && (
                    <AchievementCard
                      buttonText={
                        !evaluationStatus
                          ? 'ثبت درخواست مدرک کارآموزی'
                          : evaluationStatus !== 'JSEUS_Published'
                            ? 'لطفا منتظر تکمیل سنجش مهارت‌هاتون باشید'
                            : 'دریافت مدرک کارآموزی'
                      }
                      description={`میتونین مدرکی جهت تایید گذروندن دوره کارآموزی مجازی از طرف ${simulator?.organizationName}  دریافت کنید.`}
                      imageUrl="/images/achievement3.png"
                      title="مدرک کار آموزی مجازی"
                      onClick={() => {
                        if (!evaluationStatus) {
                          handleUserWantsEvaluator()

                          return
                        } else if (evaluationStatus !== 'JSEUS_Published') {
                          toast('تا تکمیل سنجش مهارت‌هاتون منتظر بمونید')

                          return
                        }
                        if (!user?.nationalCode) {
                          return toast(() => (
                            <div className="flex items-center gap-2">
                              <p>ابتدا پروفایل خود را کامل کنید</p>
                              <Button
                                size="sm"
                                to="/auth/profile"
                                variant="light"
                              >
                                تکمیل پروفایل
                              </Button>
                            </div>
                          ))
                        }
                        handleDownloadPdf(
                          <Completion
                            jobSimulationName={simulator?.title}
                            organizationLogoUrl={fileAddress(simulator?.organizationLogoId)}
                            organizationName={simulator?.organizationName}
                            skills={chartData}
                            user={user}
                          />,
                          'Completion',
                          'portrait'
                        )
                      }}
                    />
                  )}
                  {simulatorHasEvaluation && (
                    <AchievementCard
                      buttonColor={
                        evaluationRequestedNoEvaluator
                          ? 'secondary'
                          : evaluationInProgress
                            ? 'success'
                            : !userHasEvaluator
                              ? 'primary'
                              : 'secondary'
                      }
                      buttonText={
                        evaluationRequestedNoEvaluator
                          ? 'لطفا منتظر تکمیل سنجش مهارت‌هاتون باشید'
                          : evaluationInProgress
                            ? 'لطفا منتظر تکمیل سنجش مهارت‌هاتون باشید'
                            : !userHasEvaluator
                              ? `ثبت درخواست سنجش مهارت`
                              : 'مشاهده‌ی تحلیل سنجش مهارت‌'
                      }
                      description="برای سنجش عمیق‌تر توانمندی‌های خودتون، می‌تونین درخواست ثبت کنین و از پیشنهاد‌های یک متخصص و صاحب نظر در این حوزه‌ی کاری، به عنوان سرپرست کارآموزی خودتون استفاده کنین."
                      disabled={evaluationRequestedNoEvaluator || evaluationInProgress}
                      imageUrl="/images/achievement1.png"
                      title="سنجش مهارت‌های شما و مدرک کارآموزی"
                      onClick={() =>
                        evaluationRequestedNoEvaluator || evaluationInProgress
                          ? null
                          : userHasEvaluator
                            ? setActiveTab('Evaluation')
                            : handleUserWantsEvaluator()
                      }
                    />
                  )}
                </div>
              </AccordionSection>
            </div>
            {userHasEvaluator && simulatorDetail?.evaluation?.skills?.length ? (
              <div className="flex flex-col xl:flex-row md:gap-6 mt-5 md:mt-0">
                <div className="rounded-xl px-5 pt-4 pb-6 bg-white flex flex-col gap-6 md:min-w-[343px]">
                  <p className="font-bold text-text-dark text-lg text-nowrap">تحلیل امتیاز ارزیاب</p>
                  {simulatorDetail?.evaluation?.skills?.map((skill: any, index: number) => (
                    <RatingProgressCard
                      key={skill?.id ? skill.id : index}
                      color={skill?.score >= 60 ? 'success' : 'danger'}
                      score={skill?.score}
                      scoreClassName="text-xs"
                      title={skill?.skillTitle}
                      titleClassName="text-sm"
                    />
                  ))}
                  <Button
                    fullWidth
                    color="secondary"
                    onClick={() => setActiveTab('Evaluation')}
                  >
                    تحلیل دقیق ارزیاب از عملکرد شما
                  </Button>
                </div>
                <div className="flex flex-col grow">
                  <div className="w-full bg-white border shadow-medium flex items-center relative p-6 rounded-xl mb-10 mt-5">
                    <div className="absolute right-4 bg-white h-full w-10 z-10 hidden md:block " />
                    <div className="p-4 absolute right-10 bg-white rounded-full shadow-medium border hidden md:block ">
                      <CircularProgress
                        aria-label="Loading..."
                        classNames={{
                          svg: 'w-20 h-20',
                          value: 'text-lg',
                        }}
                        color="primary"
                        showValueLabel={true}
                        size="lg"
                        value={totalScore}
                      />
                    </div>
                    <div className="absolute right-[140px] bg-white h-full w-10 z-10 hidden md:block " />
                    <p className="text-text-dark md:mr-40">شما {totalScore} امتیاز از ۱۰۰ امتیاز این شبیه ساز را دریافت کرده اید</p>
                  </div>
                </div>
              </div>
            ) : evaluationRequestedNoEvaluator ? (
              <div className="mt-5 md:mt-0">
                <Alert title="درخواست ارزیابی شما در حال بررسی است." />
              </div>
            ) : (
              evaluationInProgress && (
                <div className="mt-5 md:mt-0">
                  <Alert
                    color="success"
                    title="منتظر ارزیابی ماموریت‌هات بمون."
                  />
                </div>
              )
            )}
          </Tab>
          <Tab
            key="Evaluation"
            title="ارزیابی"
          >
            <div className="flex flex-col gap-5 md:gap-9">
              <div className="bg-white p-6 rounded-xl flex flex-col gap-5">
                <div className="flex items-center gap-3 mx-auto">
                  <PlayIcon className="size-6 text-primary" />
                  <p className="font-bold text-lg leading-7 text-text-dark">فایل صوتی ارزیابی:</p>
                </div>
                <div className="">
                  {simulatorDetail?.evaluation?.voiceFileId && simulatorDetail?.evaluation?.voiceFileId !== '000000000000000000000000' ? (
                    <AudioPlayer audioId={simulatorDetail?.evaluation?.voiceFileId} />
                  ) : (
                    <Alert title="لطفا منتظر تکمیل ارزیابی خود باشید." />
                  )}
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <div className="size-[10px] bg-success rounded-full" />
                  <p className="font-bold text-lg leading-7 text-text-dark">نقاط قوت</p>
                </div>
                <div className="text-sm text-justify text-text-light-25">
                  {simulatorDetail?.evaluation?.positivePoints ? (
                    <HtmlRenderer htmlContent={simulatorDetail?.evaluation?.positivePoints} />
                  ) : (
                    <Alert title="لطفا منتظر تکمیل ارزیابی خود باشید." />
                  )}
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <div className="size-[10px] bg-error rounded-full" />
                  <p className="font-bold text-lg leading-7 text-text-dark">نقاط ضعف</p>
                </div>
                <div className="text-sm text-justify text-text-light-25">
                  {simulatorDetail?.evaluation?.negativePoints ? (
                    <HtmlRenderer htmlContent={simulatorDetail?.evaluation?.negativePoints} />
                  ) : (
                    <Alert title="لطفا منتظر تکمیل ارزیابی خود باشید." />
                  )}
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <div className="size-[10px] bg-primary rounded-full" />
                  <p className="font-bold text-lg leading-7 text-text-dark">پیشنهاد برای بهبود</p>
                </div>
                <div className="text-sm text-justify text-text-light-25">
                  {simulatorDetail?.evaluation?.suggestion ? (
                    <HtmlRenderer htmlContent={simulatorDetail?.evaluation?.suggestion} />
                  ) : (
                    <Alert title="لطفا منتظر تکمیل ارزیابی خود باشید." />
                  )}
                </div>
              </div>
            </div>
          </Tab>
          <Tab
            key="skills"
            title="مهارت ها"
          >
            <div className="flex flex-col gap-5 md:gap-9">
              {simulatorDetail?.evaluation?.skills?.length ? (
                simulatorDetail?.evaluation?.skills?.map((skill: any, index: number) => (
                  <div
                    key={skill ? skill?.id + index : index}
                    className="bg-white px-4 py-5 rounded-xl flex flex-col gap-5"
                  >
                    <RatingProgressCard
                      color={skill?.score >= 60 ? 'success' : 'danger'}
                      score={skill?.score}
                      title={skill?.skillTitle}
                    />
                    <div className="flex flex-col gap-3 border-t border-background-70 pt-4">
                      <div className="flex items-center gap-2">
                        <div className="size-[10px] bg-primary rounded-full" />
                        <p className="text-xs leading-5 text-text-light-25">منابع پیشنهادی:</p>
                      </div>
                      <div className="flex items-center flex-wrap gap-[10px] md:gap-4">
                        {skill?.suggestions?.map((suggestion: any, index: number) => (
                          <Button
                            key={suggestion ? suggestion?.itemId : index}
                            className="font-normal"
                            color={index % 2 === 0 ? 'secondary' : 'primary'}
                            size="sm"
                            to={`/simulators/${suggestion?.itemId}`}
                          >
                            {truncateText(suggestion?.itemTitle, 50)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <Alert title="لطفا منتظر تکمیل ارزیابی خود باشید." />
              )}
            </div>
          </Tab>
        </Tabs>
      </section>
      <ReviewRateModal
        isOpen={isOpenReviewRateModal}
        jobSimulationUserId={params.id}
        setIsOpen={setIsOpenReviewRateModal}
      />
      <CommentModal
        isOpen={isOpenCommentModal}
        jobSimulationUserId={params.id}
        setIsOpen={setIsOpenCommentModal}
        onCommentSent={() =>
          handleDownloadPdf(
            <Participation
              jobSimulationName={simulator?.title}
              organizationName={simulator?.organizationName}
              skills={chartData}
              user={user}
            />,
            'Participation'
          )
        }
      />
      <Modal
        hideFooter
        hideHeader
        isOpen={isOpen}
        size="lg"
        onOpenChange={onOpenChange}
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <img
            alt="achievement"
            height={186}
            src="/images/achievement1.png"
            width={220}
          />
          <p className="text-xl leading-8 text-text-dark font-bold">دریافت مدرک کار آموزی و سنجش مهارت ها</p>
          <p className="text-sm">
            با دریافت مدرک کارآموزی برای شبیه‌سازی که در اون شرکت کردی، علاوه بر مدرک؛ می‌تونی سنجش عمیق‌تری از توانمندی‌های خودت داشته
            باشی.
          </p>
        </div>
        <div className="w-full h-[1px] bg-background-50" />
        <div>
          <Button
            fullWidth
            onClick={handleUserWantsEvaluator}
          >
            دریافت مدرک کار آموزی
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default SimulatorDetails

'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, use, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import Button from '@/components/formElements/Button'
import useAuth from '@/hooks/useAuth'
import useGlobal from '@/hooks/useGlobal'
import useLoading from '@/hooks/useLoading'
import useWindowSize from '@/hooks/useWindowSize'
import { INSERT_TASK_BY_USER_ID, REGISTER_USER_IN_SIMULATION } from '@/services/simulationUser'
import { GET_ALL_TASKS_BY_SIMULATION_ID_FOR_LEARNERS } from '@/services/tasks'
import SuccessImage from '@/components/ui/SuccessImage'
import Quiz from '@/app/start-simulator/[id]/Quiz'
import Loading from '@/components/layouts/Loading'
import StepOne from '@/app/start-simulator/[id]/(steps)/StepOne'
import StepTwo from '@/app/start-simulator/[id]/(steps)/StepTwo'
import StepThree from '@/app/start-simulator/[id]/(steps)/StepThree'
import StepFour from '@/app/start-simulator/[id]/(steps)/StepFour'
import StepFive from '@/app/start-simulator/[id]/(steps)/StepFive'

type jobSimulationUserTaskType = { taskId: string; uploadedAt: string; userFileId: string }

const StartSimulator = ({ params: promisedParams }: PropsWithParams) => {
  const params = use(promisedParams)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const { user } = useAuth()
  const { setLoading: setGlobalLoading } = useLoading()
  const { data, setData } = useGlobal()
  const { width } = useWindowSize()

  const [loading, setLoading] = useState(false)
  const [simulator, setSimulator] = useState<any>()
  const [jobSimulationUser, setJobSimulationUser] = useState<any>(null)
  const [fileId, setFileId] = useState<string>('')
  const [tasks, setTasks] = useState<any[]>()
  const [currentTaskId, setCurrentTaskId] = useState<string>(searchParams.has('taskId') ? String(searchParams.get('taskId')) : '')
  const [page, setPage] = useState<number>(searchParams.has('page') ? Number(searchParams.get('page')) : 1)
  const [showSuccessPage, setShowSuccessPage] = useState(false)
  const [showQuizPage, setShowQuizPage] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(264)
  const [navigationButtonsHeight, setNavigationButtonsHeight] = useState(96)

  const currentTaskHasFileId = useMemo(() => {
    return !!jobSimulationUser?.tasks?.find((task: jobSimulationUserTaskType) => task.taskId === currentTaskId)
  }, [jobSimulationUser, currentTaskId, fileId])

  const currentTaskIndex = useMemo(
    () => (tasks && tasks.length ? tasks.findIndex((item) => item.id === currentTaskId) : 0),
    [tasks, currentTaskId]
  )

  const activeTask = useMemo(() => (tasks && tasks.length ? tasks[currentTaskIndex] : {}), [tasks, currentTaskId])

  const prevButtonDetail = useMemo(() => {
    if (page === 1) {
      return {
        name: 'ماموریت قبلی',
        action: () => {
          setCurrentTaskId(tasks && tasks.length ? tasks[currentTaskIndex - 1].id : '')
          setPage(5)
        },
      }
    } else {
      return {
        name: 'قبلی',
        action: () => {
          setPage((prev) => prev - 1)
        },
      }
    }
  }, [page])

  const nextButtonDetail = useMemo(() => {
    if (tasks && tasks.length && currentTaskId === tasks[tasks?.length - 1].id && page === 5) {
      return {
        name: simulator?.hasQuiz ? 'شروع آزمون' : 'پایان شبیه سازی',
        action: () => {
          // باید چک شود که ازمون تعریف شده یا نه اگر بود بره به اون صفحه
          if (simulator?.hasQuiz) {
            setShowQuizPage(true)
          } else {
            toast.success('تبریک! ماموریت نهایی تکمیل شد.')

            return router.replace(`/user/simulators/${jobSimulationUser?.id}`)
          }
        },
      }
    } else {
      if (page === 5) {
        return {
          name: 'ماموریت بعدی',
          action: () => {
            if (!showSuccessPage) {
              setShowSuccessPage(true)
            } else {
              setCurrentTaskId(tasks && tasks.length ? tasks[currentTaskIndex + 1].id : '')
              setShowSuccessPage(false)
              setPage(1)
              setFileId('')
            }
          },
        }
      } else {
        return {
          name: 'بعدی',
          action: async () => {
            if (page === 3) {
              if (currentTaskHasFileId) {
                setPage((prev) => prev + 1)
              } else {
                await handleUploadTemplate()
              }
            } else {
              setPage((prev) => prev + 1)
            }
          },
        }
      }
    }
  }, [page, currentTaskId, currentTaskHasFileId, fileId, showSuccessPage])

  useEffect(() => {
    const sidebar = document.querySelector('#start-simulator-sidebar')
    const bottomNav = document.querySelector('#start-simulator-navigation-buttons')

    const updateDimensions = () => {
      if (sidebar) {
        setSidebarWidth(sidebar.getBoundingClientRect().width)
      }
      if (bottomNav) {
        setNavigationButtonsHeight(bottomNav.getBoundingClientRect().height)
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions()
    })

    if (sidebar) resizeObserver.observe(sidebar)
    if (bottomNav) resizeObserver.observe(bottomNav)

    // Clean up observer on unmount
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    if (showQuizPage) {
      router.replace(`${pathname}?page=${page}&taskId=${currentTaskId}&quiz=${showQuizPage}`)
    } else {
      router.replace(`${pathname}?page=${page}&taskId=${currentTaskId}`)
    }
  }, [page, currentTaskId, showQuizPage])

  useEffect(() => {
    if (searchParams.has('page')) {
      setPage(Number(searchParams.get('page')))
    }
    if (searchParams.has('taskId')) {
      setCurrentTaskId(String(searchParams.get('taskId')))
    }
    if (searchParams.has('quiz')) {
      setShowQuizPage(searchParams.get('quiz') === 'true')
    }
  }, [searchParams])

  useEffect(() => {
    setSimulator(data.data?.simulator)
  }, [data])

  const registerUserInSimulation = async () => {
    try {
      setGlobalLoading(true)
      const response = await REGISTER_USER_IN_SIMULATION({ jobSimulationId: params.id })

      setJobSimulationUser(response.data)
    } catch (error) {
      console.log('error', error)
    } finally {
      setGlobalLoading(false)
    }
  }

  const getTasks = async () => {
    try {
      setGlobalLoading(true)
      const response = await GET_ALL_TASKS_BY_SIMULATION_ID_FOR_LEARNERS(params.id)

      setData('data', response.data)
      setTasks(response.data.jobSimulationTasks)
      setCurrentTaskId(response.data.jobSimulationTasks[0].id)
    } catch (error) {
      console.log('error', error)
    } finally {
      setGlobalLoading(false)
    }
  }

  useEffect(() => {
    registerUserInSimulation()
    getTasks()
  }, [])

  useEffect(() => {
    if (tasks?.length && jobSimulationUser?.tasks?.length) {
      const lastTask = jobSimulationUser?.tasks[jobSimulationUser?.tasks?.length - 1]
      const lastTaskIndex = tasks.findIndex((item: any) => item.id === lastTask.taskId)
      const nextTask = tasks[lastTaskIndex + 1]

      setCurrentTaskId(nextTask ? nextTask.id : tasks[0].id)
      setPage(1)
    }
  }, [tasks])

  const handleUploadTemplate = async () => {
    try {
      setLoading(true)
      if (user && tasks && tasks.length) {
        await INSERT_TASK_BY_USER_ID(jobSimulationUser?.id, {
          taskId: tasks[currentTaskIndex].id,
          userFileId: fileId,
        })
        const taskData = {
          taskId: currentTaskId,
          userFileId: fileId,
          uploadedAt: '',
        }

        setJobSimulationUser((prev: any) => ({ ...prev, tasks: [...prev.tasks, taskData] }))
        toast.success(`فایل ${activeTask.title} شما با موفقیت ثبت شد.`)
        setPage((prev) => prev + 1)
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      className="px-6 pt-0 md:pt-10"
      style={{ paddingBottom: navigationButtonsHeight + 24 + 'px' }}
    >
      {page === 1 && !showSuccessPage && !showQuizPage && <StepOne introduction={activeTask?.introduction} />}
      {page === 2 && !showSuccessPage && !showQuizPage && <StepTwo taskIntroduction={activeTask?.taskIntroduction} />}
      {page === 3 && !showSuccessPage && !showQuizPage && (
        <StepThree
          currentTaskHasFileId={currentTaskHasFileId}
          currentTaskIndex={currentTaskIndex}
          setUploadedFileId={setFileId}
          uploadedFileId={fileId}
          userFile={activeTask?.userFile}
          userFileId={jobSimulationUser?.tasks?.find((task: jobSimulationUserTaskType) => task.taskId === currentTaskId)?.userFileId}
        />
      )}
      {page === 4 && !showSuccessPage && !showQuizPage && <StepFour correctFile={activeTask?.correctFile} />}
      {page === 5 && !showSuccessPage && !showQuizPage && <StepFive summary={activeTask?.summary} />}
      {showSuccessPage && <SuccessImage />}
      {showQuizPage && (
        <Quiz
          jobSimulationId={params.id}
          jobSimulationUser={jobSimulationUser}
        />
      )}
      {!showQuizPage && (
        <div
          className={`shadow-small flex justify-between py-6 px-4 gap-[10px] md:gap-0 fixed bg-white bottom-0 z-30 left-0`}
          id="start-simulator-navigation-buttons"
          style={{
            width: `calc(100% - ${width > 768 ? sidebarWidth : 0}px)`,
          }}
        >
          {page !== 1 || currentTaskIndex > 0 ? (
            <Button
              className="w-full md:w-[250px]"
              isLoading={loading}
              size="lg"
              variant="bordered"
              onClick={() => prevButtonDetail.action()}
            >
              {prevButtonDetail.name}
            </Button>
          ) : (
            <div className="hidden md:block" />
          )}
          <Button
            className="w-full md:w-[250px]"
            disabled={page === 3 && !currentTaskHasFileId && !fileId}
            isLoading={loading}
            size="lg"
            onClick={() => nextButtonDetail.action()}
          >
            {nextButtonDetail.name}
          </Button>
        </div>
      )}
    </section>
  )
}

const StartSimulatorWrapper = (props: PropsWithParams) => {
  return (
    <Suspense fallback={<Loading />}>
      <StartSimulator {...props} />
    </Suspense>
  )
}

export default StartSimulatorWrapper

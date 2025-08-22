'use client'
import { CircularProgress } from '@heroui/progress'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

import Button from '@/components/formElements/Button'
import UserVerticalStepper from '@/components/utils/UserVerticalStepper'
import useGlobal from '@/hooks/useGlobal'

const Sidebar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const { data } = useGlobal()

  const [simulator, setSimulator] = useState<any>()
  const [tasks, setTasks] = useState<any[]>()
  const [currentTaskId, setCurrentTaskId] = useState<string>(searchParams.has('taskId') ? String(searchParams.get('taskId')) : '')
  const [page, setPage] = useState<number>(searchParams.has('page') ? Number(searchParams.get('page')) : 1)

  useEffect(() => {
    setTasks(data.data?.jobSimulationTasks)
    setSimulator(data.data?.simulator)
  }, [data])

  useEffect(() => {
    router.replace(`${pathname}?page=${page}&taskId=${currentTaskId}`)
  }, [page, currentTaskId])

  useEffect(() => {
    if (searchParams.has('page')) {
      setPage(Number(searchParams.get('page')))
    }
    if (searchParams.has('taskId')) {
      setCurrentTaskId(String(searchParams.get('taskId')))
    }
  }, [searchParams])

  const isActivePage = (step: number) => step === page

  const currentTaskIndex = useMemo(
    () => (tasks && tasks.length ? tasks.findIndex((item) => item.id === currentTaskId) : 0),
    [tasks, currentTaskId]
  )

  const calculateProgress = useMemo((): number => {
    if (tasks && tasks.length) {
      return (currentTaskIndex / tasks.length) * 100
    } else {
      return 0
    }
  }, [tasks, currentTaskId])

  const activeTask = useMemo(() => (tasks && tasks.length ? tasks[currentTaskIndex] : {}), [tasks, currentTaskId])

  return (
    <div
      className="bg-white md:bg-background-primary py-6 px-5 flex flex-col gap-6 md:max-w-[300px]"
      id="start-simulator-sidebar"
    >
      <div className="rounded-xl p-4 flex md:flex-col gap-4 bg-white shadow-lg md:shadow-none">
        <CircularProgress
          aria-label="Loading..."
          className="mx-auto"
          classNames={{
            svg: 'w-20 h-20',
            value: 'text-lg',
          }}
          color="primary"
          showValueLabel={true}
          size="lg"
          value={calculateProgress}
        />
        <div className="flex flex-col justify-center md:justify-normal gap-2 overflow-hidden text-ellipsis">
          <p className="text-text-dark font-semibold">{simulator?.title}</p>
          <div className="flex gap-2 items-center">
            <p className="text-primary text-sm font-bold">
              <span className="text-xs text-text-light-25 text-nowrap ml-2">ماموریت {currentTaskIndex + 1}</span>
              {activeTask?.title}
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-xl p-4 flex flex-col gap-4 bg-white">
        <p className="font-bold text-text-dark">مراحل ماموریت {currentTaskIndex + 1}</p>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((item, index) => (
            <Button
              key={index}
              iconOnly
              className="rounded-full"
              color={isActivePage(item) ? 'primary' : 'default'}
              disabled={item > page}
              size="sm"
              onClick={() => setPage(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
      <div className="rounded-xl p-4 bg-white md:flex flex-col gap-5 hidden">
        <p className="font-bold text-text-dark mx-auto">وظایف اجرایی شبیه ساز</p>
        <UserVerticalStepper
          currentStep={currentTaskIndex}
          stepsDetail={tasks && tasks?.length ? tasks : []}
        />
      </div>
    </div>
  )
}

export default Sidebar

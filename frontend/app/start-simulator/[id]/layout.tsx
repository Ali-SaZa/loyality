'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import Navbar from '@/components/layouts/user/Navbar'
import Sidebar from '@/components/layouts/start-simulator/Sidebar'
import useGlobal from '@/hooks/useGlobal'
import UserVerticalStepper from '@/components/utils/UserVerticalStepper'
import CheckIcon from '@/components/icons/CheckIcon'
import useLoading from '@/hooks/useLoading'
import { GET_SIMULATION_BY_ID } from '@/services/simulations'

const StartSimulationLayout = ({ children }: { children: React.ReactNode }) => {
  const { data, setData } = useGlobal()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { setLoading } = useLoading()

  const [simulator, setSimulator] = useState<any>()
  const [page, setPage] = useState<number>(searchParams.has('page') ? Number(searchParams.get('page')) : 1)
  const [currentTaskId, setCurrentTaskId] = useState<string>(searchParams.has('taskId') ? String(searchParams.get('taskId')) : '')
  const [tasks, setTasks] = useState<any[]>()

  const currentTaskIndex = useMemo(
    () => (tasks && tasks.length ? tasks.findIndex((item) => item.id === currentTaskId) : 0),
    [tasks, currentTaskId]
  )

  const getSimulator = async () => {
    setLoading(true)

    const response = await GET_SIMULATION_BY_ID(pathname.split('/').pop() as string)

    setData('data', { simulator: response.data })

    setSimulator(response.data)

    setLoading(false)
  }

  useEffect(() => {
    router.replace(`${pathname}?page=${page}&taskId=${currentTaskId}`)
  }, [page, currentTaskId])

  useEffect(() => {
    setTasks(data.data?.jobSimulationTasks)
  }, [data])

  useEffect(() => {
    getSimulator()
  }, [])

  return (
    <section className="flex w-screen h-[100dvh] flex-col">
      <Navbar
        showBrand
        menuChildren={
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="bg-primary text-white font-bold text-center rounded-t-2xl rounded-b-lg w-full p-4">مرحال اجرایی شبیه ساز</div>
              <div className="bg-background-10 rounded-xl p-4">
                <UserVerticalStepper
                  currentStep={currentTaskIndex}
                  stepsDetail={tasks && tasks?.length ? tasks : []}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="bg-secondary text-white font-bold text-center rounded-t-2xl rounded-b-lg w-full p-4">دستاورد ها</div>
              <div className="bg-background-10 rounded-xl p-4 flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <div className="bg-success rounded-full size-5 flex items-center justify-center">
                    <CheckIcon className="text-white size-3" />
                  </div>
                  <p className="font-semibold text-text-dark">گواهی نامه حضور در شبیه ساز</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-success rounded-full size-5 flex items-center justify-center">
                    <CheckIcon className="text-white size-3" />
                  </div>
                  <p className="font-semibold text-text-dark">ارزیابی عملکرد توسط ارزیاب</p>
                </div>
                {simulator?.hasOfficialCertificate && (
                  <div className="flex items-center gap-2">
                    <div className="bg-success rounded-full size-5 flex items-center justify-center">
                      <CheckIcon className="text-white size-3" />
                    </div>
                    <p className="font-semibold text-text-dark">مدرک کار آموزی مجازی</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        }
        title={simulator?.title}
      />

      <div className="flex flex-col md:flex-row w-full h-full overflow-y-auto md:overflow-hidden">
        <Sidebar />
        <div className="w-full md:overflow-y-auto">{children}</div>
      </div>
    </section>
  )
}

export default StartSimulationLayout

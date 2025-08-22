import Link from 'next/link'
import React, { useMemo } from 'react'

import Button from '@/components/formElements/Button'
import HeadsetIcon from '@/components/icons/HeadsetIcon'
import ListIcon from '@/components/icons/ListIcon'
import { fileAddress } from '@/helpers'

interface UserSimulatorCardProps {
  simulator: any
  index: number
}

const UserSimulatorCard = ({ simulator, index }: UserSimulatorCardProps) => {
  const complete = useMemo(() => simulator?.status === 'JSUS_Completed', [simulator?.status])

  return (
    <div className="rounded-lg shadow-md flex flex-col">
      <div className={`bg-primary ${complete && 'bg-success'} py-2 px-3 flex items-center justify-between rounded-t-lg`}>
        <div className="flex items-center gap-1">
          <div className={`flex items-center justify-center bg-primary-15 ${complete && '!bg-[#97DCC9]'} rounded-lg text-white size-6`}>
            {index + 1}
          </div>
          <p className="font-semibold leading-6 text-white">{simulator?.jobSimulationTitle}</p>
        </div>
      </div>
      <Link href={complete ? `/user/simulators/${simulator?.id}` : `/start-simulator/${simulator?.jobSimulationId}`}>
        <div className="flex flex-col p-3 pb-4 gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="size-6 rounded-full flex items-center justify-center">
                <img
                  alt="brand"
                  height={16.8}
                  src={fileAddress(simulator?.organizationLogoId)}
                  width={14.4}
                />
              </div>
              <p className="font-bold text-text-light-25 text-sm leading-6">{simulator?.organizationName}</p>
            </div>
            {simulator?.evaluationStatus === 'JSEUS_Pending' && (
              <Button
                color="warning"
                iconStart={<HeadsetIcon className="size-5 text-warning" />}
                size="sm"
                variant="flat"
              >
                <p className="font-normal">در انتظار ارزیاب</p>
              </Button>
            )}
            {simulator?.evaluationStatus === 'JSEUS_InProgress' && (
              <Button
                color="success"
                iconStart={<HeadsetIcon className="size-5 text-success" />}
                size="sm"
                variant="flat"
              >
                <p className="font-normal">درحال ارزیابی</p>
              </Button>
            )}
            {simulator?.evaluationStatus === 'JSEUS_Published' && (
              <Button
                iconStart={<HeadsetIcon className="size-5 text-primary" />}
                size="sm"
                variant="flat"
              >
                <p className="font-normal">تکمیل ارزیابی</p>
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ListIcon className="size-[18px] pl-1" />
                {!complete ? (
                  <p className="font-bold text-sm leading-6 text-text-dark">{simulator?.lastTaskTitle}</p>
                ) : (
                  <p className="font-bold text-sm leading-6 text-text-dark">تکمیل شده</p>
                )}
              </div>
              <p className="font-bold text-sm leading-6 text-text-dark">
                {simulator?.completedTaskCount}/{simulator?.totalTaskCount}
              </p>
            </div>
            <div className="w-[95%] h-1 relative rounded-sm bg-background-50 overflow-hidden">
              <div
                className={`bg-primary ${complete && 'bg-success'} absolute right-0 rounded-sm h-1`}
                style={{ width: `${(simulator?.completedTaskCount / simulator?.totalTaskCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default UserSimulatorCard

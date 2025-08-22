import { Tooltip } from '@nextui-org/tooltip'
import React, { useEffect, useState } from 'react'

import EyeIcon from '../icons/EyeIcon'
import TrashIcon from '../icons/TrashIcon'
import EditIcon from '../icons/EditIcon'

import Button from '@/components/formElements/Button'

interface DynamicTableActionButtonProps {
  onClick?: () => void
  type:
    | 'delete'
    | 'learnersList'
    | 'edit'
    | 'analysisEvaluator'
    | 'evaluator'
    | 'file'
    | 'simulation'
    | 'evaluatorsList'
    | 'fileView'
    | 'course'
    | 'archive'
    | 'report'
    | 'changeEvaluator'
    | 'download'
    | 'statusChange'
    | 'StatusSubmit'
    | 'payment'
    | 'userComments'
    | 'transactions'
}

type actionDetailsType = {
  tooltipContent: string
  icon: React.ReactNode
  iconColor: string
  bgColor: string
}

const DynamicTableActionButton = ({ onClick, type }: DynamicTableActionButtonProps) => {
  const [actionDetails, setActionDetails] = useState<actionDetailsType | undefined>()

  useEffect(() => {
    switch (type) {
      case 'delete':
        setActionDetails({
          tooltipContent: 'حذف',
          icon: <TrashIcon className="size-4" />,
          iconColor: 'text-[#ED2E7E]',
          bgColor: 'bg-[#FFF0F6]',
        })
        break
      case 'learnersList':
        setActionDetails({
          tooltipContent: 'لیست دانشجویان',
          icon: <TrashIcon className="size-4" />,
          iconColor: 'text-[#47BEC6]',
          bgColor: 'bg-[#F0FEFF]',
        })
        break
      case 'edit':
        setActionDetails({
          tooltipContent: 'ویرایش',
          icon: <EditIcon className="size-4" />,
          iconColor: 'text-[#5D5FEF]',
          bgColor: 'bg-[#E3E3F4]',
        })
        break
      case 'analysisEvaluator':
        setActionDetails({
          tooltipContent: 'تحلیل ارزیاب',
          icon: <TrashIcon className="size-4" />,
          iconColor: 'text-[#FFB470]',
          bgColor: 'bg-[#FFF4DF]',
        })
        break
      case 'evaluator':
        setActionDetails({
          tooltipContent: 'ارزیاب',
          icon: <TrashIcon className="size-4" />,
          iconColor: 'text-[#EF5DA8]',
          bgColor: 'bg-[#FCDDEC]',
        })
        break
      case 'file':
        setActionDetails({
          tooltipContent: 'پرونده',
          icon: <TrashIcon className="size-4" />,
          iconColor: 'text-[#00B2DA]',
          bgColor: 'bg-[#F1FDFF]',
        })
        break
      case 'simulation':
        setActionDetails({
          tooltipContent: 'شبیه ساز',
          icon: <TrashIcon className="size-4" />,
          iconColor: 'text-[#3A4D9A]',
          bgColor: 'bg-[#D9DEF1]',
        })
        break
      case 'evaluatorsList':
        setActionDetails({
          tooltipContent: 'لیست ارزیاب ها',
          icon: <TrashIcon className="size-4" />,
          iconColor: 'text-[#F178B6]',
          bgColor: 'bg-[#FCDDEC]',
        })
        break
      case 'fileView':
        setActionDetails({
          tooltipContent: 'مشاهده پرونده',
          icon: <EyeIcon className="size-4" />,
          iconColor: 'text-[#00BA88]',
          bgColor: 'bg-[#F2FFFB]',
        })
        break
      case 'course':
        setActionDetails({
          tooltipContent: 'دوره',
          icon: <TrashIcon className="size-4" />,
          iconColor: 'text-[#DEC56B]',
          bgColor: 'bg-[#FCF9F0]',
        })
        break
      case 'archive':
        setActionDetails({
          tooltipContent: 'انتقال به آرشیو',
          icon: <TrashIcon className="size-4" />,
          iconColor: 'text-[#D33030]',
          bgColor: 'bg-[#F2DEDE]',
        })
        break
      case 'report':
        setActionDetails({
          tooltipContent: 'گزارش',
          icon: <TrashIcon className="size-4" />,
          iconColor: 'text-[#00B2DA]',
          bgColor: 'bg-[#F1FDFF]',
        })
        break
      case 'changeEvaluator':
        setActionDetails({
          tooltipContent: 'تغییر ارزیاب',
          icon: <TrashIcon className="size-4" />,
          iconColor: 'text-[#EF5DA8]',
          bgColor: 'bg-[#FCDDEC]',
        })
        break
      case 'download':
        setActionDetails({
          tooltipContent: 'دانلود',
          icon: <TrashIcon className="size-4" />,
          iconColor: 'text-[#3A4D9A]',
          bgColor: 'bg-[#D9DEF1]',
        })
        break
      case 'statusChange':
        setActionDetails({
          tooltipContent: 'تغییر وضعیت',
          icon: <TrashIcon className="size-4" />,
          iconColor: 'text-white',
          bgColor: 'bg-[#DEC56B]',
        })
        break
      case 'StatusSubmit':
        setActionDetails({
          tooltipContent: 'تعیین وضعیت',
          icon: <TrashIcon className="size-4" />,
          iconColor: 'text-[#00B2DA]',
          bgColor: 'bg-[#F1FDFF]',
        })
        break
      case 'payment':
        setActionDetails({
          tooltipContent: 'پرداخت هزینه',
          icon: <TrashIcon className="size-4" />,
          iconColor: 'text-[#FCD635]',
          bgColor: 'bg-[#FCF9F0]',
        })
        break
      case 'userComments':
        setActionDetails({
          tooltipContent: 'نظرات کاربران',
          icon: <TrashIcon className="size-4" />,
          iconColor: 'text-[#00B2DA]',
          bgColor: 'bg-[#F0FEFF]',
        })
        break
      case 'transactions':
        setActionDetails({
          tooltipContent: 'تراکنش ها',
          icon: <TrashIcon className="size-4" />,
          iconColor: 'text-[#703FC4]',
          bgColor: 'bg-[#E6D7FF]',
        })
        break
      // Add more cases for other action types...
    }
  }, [type])

  return (
    <Tooltip
      showArrow
      content={actionDetails?.tooltipContent}
    >
      <span className="text-default-400 cursor-pointer active:opacity-50">
        <Button
          iconOnly
          className={`${actionDetails?.bgColor} ${actionDetails?.iconColor}`}
          size="sm"
          variant="flat"
          onClick={onClick}
        >
          {actionDetails?.icon}
        </Button>
      </span>
    </Tooltip>
  )
}

export default DynamicTableActionButton

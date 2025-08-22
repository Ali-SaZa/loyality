'use client'
import React from 'react'
import { Chip } from '@nextui-org/chip'
import { Snippet } from '@nextui-org/snippet'

import PaginatedList from '@/components/utils/PaginatedList'
import useGlobal from '@/hooks/useGlobal'
import { convertToDateString, formatDateToCustomTimezone, getTimeFromDateString } from '@/helpers'
import CalendarIcon from '@/components/icons/CalendarIcon'
import ClockIcon from '@/components/icons/ClockIcon'
import DollarIcon from '@/components/icons/DollarIcon'

const Transactions = () => {
  const { data: globalData } = useGlobal()
  const columns = [
    { label: 'کد پیگیری بانکی', field: 'bankTrackingCode', sortable: true, filterable: true, type: 'text' },
    { label: 'کد پیگیری سایت', field: 'id', sortable: true, filterable: true, type: 'text' },
    { label: 'هزینه پرداختی', field: 'amount', sortable: true, filterable: true, type: 'text' },
    { label: 'تاریخ و زمان پرداخت', field: 'createdAt', sortable: true, filterable: true, type: 'dateFromTo' },
    {
      label: 'وضعیت',
      field: 'status',
      sortable: true,
      filterable: true,
      type: 'select',
      filterItems: globalData.orderStatus,
    },
  ]

  return (
    <section className="w-full">
      <PaginatedList
        columns={columns}
        url="/user/orders"
      >
        {{
          bankTrackingCode: (data: any, cellValue) =>
            cellValue ? (
              <Snippet
                hideSymbol
                size="sm"
                tooltipProps={{
                  content: `کپی کد پیگیری بانکی`,
                  placement: 'left',
                }}
                variant="flat"
              >
                {cellValue}
              </Snippet>
            ) : (
              'ـ'
            ),
          id: (data: any, cellValue) =>
            cellValue ? (
              <Snippet
                hideSymbol
                size="sm"
                tooltipProps={{
                  content: `کپی کد پیگیری سایت`,
                  placement: 'left',
                }}
                variant="flat"
              >
                {cellValue}
              </Snippet>
            ) : (
              'ـ'
            ),
          amount: (data: any, cellValue) => (
            <div className="flex items-center gap-1">
              <DollarIcon className="size-4" />
              <p>{(cellValue / 10).toLocaleString()} تومان</p>
            </div>
          ),
          status: (data: any, cellValue) => (
            <Chip
              color={globalData?.orderStatus?.find((item: any) => item.code === cellValue)?.color as NextUiColorType}
              radius="sm"
              size="sm"
              variant="flat"
            >
              <div className="flex items-center gap-1">
                {globalData?.orderStatus?.find((item: any) => item.code === cellValue)?.icon}
                {globalData?.orderStatus?.find((item: any) => item.code === cellValue)?.name}
              </div>
            </Chip>
          ),
          createdAt: (data: any, cellValue) => (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-4" />
                <p>{convertToDateString(formatDateToCustomTimezone(new Date(cellValue)))}</p>
              </div>
              <span className="text-text-dark">-</span>
              <div className="flex items-center gap-1">
                <ClockIcon className="size-4" />
                <p>{`${getTimeFromDateString(formatDateToCustomTimezone(new Date(cellValue))).hour}:${getTimeFromDateString(formatDateToCustomTimezone(new Date(cellValue))).minute}`}</p>
              </div>
            </div>
          ),
        }}
      </PaginatedList>
    </section>
  )
}

export default Transactions

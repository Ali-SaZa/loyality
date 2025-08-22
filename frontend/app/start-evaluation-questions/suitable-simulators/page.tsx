'use client'
import React, { useState } from 'react'

import Button from '@/components/formElements/Button'
import SimulatorCard from '@/components/card/SimulatorCard'
import Pagination from '@/components/utils/Pagination'
import EmptyListPlaceholder from '@/components/utils/EmptyListPlaceholder'

const SuitableSimulators = () => {
  const [simulators, setSimulators] = useState<any>([])
  const [totalItemsCount, setTotalItemsCount] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)

  return (
    <section className="w-full h-full flex flex-col gap-10">
      <div className="flex flex-col gap-2 text-center">
        <p className="font-semibold text-text-dark text-2xl leading-10">شبیه ساز های شغلی مناسب شما</p>
        <p>پیشنهاد های ما بر اساس علایق و استعداد های شما به این شکل است و ...</p>
      </div>
      {simulators.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {simulators.map((simulator: any) => (
              <SimulatorCard
                key={simulator!.id}
                simulator={simulator}
              />
            ))}
          </div>
          <div className="w-full flex items-center justify-end mt-10">
            <Pagination
              currentPage={page}
              total={Math.ceil(totalItemsCount / pageSize)}
              onPageChange={setPage}
            />
          </div>
        </>
      ) : (
        <EmptyListPlaceholder />
      )}
      <div className="mx-auto w-full md:w-fit flex items-center gap-2">
        <Button
          size="lg"
          to="/"
          variant="bordered"
        >
          خانه
        </Button>
        <Button
          fullWidth
          size="lg"
          to="/start-evaluation-questions"
        >
          شروع مجدد آزمون
        </Button>
      </div>
    </section>
  )
}

export default SuitableSimulators

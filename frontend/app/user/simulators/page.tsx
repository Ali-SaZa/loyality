'use client'
import { Tab, Tabs } from '@nextui-org/tabs'
import React, { useEffect, useState } from 'react'

import UserSimulatorCard from '@/components/card/UserSimulatorCard'
import useLoading from '@/hooks/useLoading'
import { GET_USER_SIMULATIONS } from '@/services/simulationUser'
import EmptyListPlaceholder from '@/components/utils/EmptyListPlaceholder'
import Pagination from '@/components/utils/Pagination'

const Simulators = () => {
  const { setLoading } = useLoading()

  // const [isOpenUpdateAvatarModal, setIsOpenUpdateAvatarModal] = useState(false)
  const [filteredSimulations, setFilteredSimulations] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'JSUS_InProgress' | 'JSUS_Completed' | 'userWantsEvaluator' | null | string | number>('all')
  const [totalItemsCount, setTotalItemsCount] = useState(0)
  const [filters, setFilters] = useState<{ [key: string]: any }>({})
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)

  const fetchUserEvaluators = async () => {
    setLoading(true)
    const params = {
      page,
      pageSize,
      filters,
    }
    const response = await GET_USER_SIMULATIONS(params)

    console.log(response)
    setTotalItemsCount(Number(response.data.response.totalItemsCount))
    setFilteredSimulations(response.data.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchUserEvaluators()
  }, [page, filters])

  useEffect(() => {
    switch (filter) {
      case 'all':
        setFilters({})
        break

      case 'userWantsEvaluator':
        setFilters({ wantEvaluator: true })
        break

      default:
        setFilters({ status: filter })
        break
    }
  }, [filter, page])

  return (
    <section className="w-full flex flex-col md:flex-row gap-8">
      <div className="flex flex-col gap-2 md:gap-5 grow">
        <Tabs
          key="light"
          aria-label="Options"
          classNames={{
            tab: 'border-2 border-primary data-[selected=true]:bg-primary data-[selected=true]:shadow-lg',
            tabContent: 'text-primary font-bold group-data-[selected=true]:text-white',
          }}
          selectedKey={filter}
          variant="light"
          onSelectionChange={setFilter}
        >
          <Tab
            key="all"
            title="همه"
          >
            {filteredSimulations && !!filteredSimulations?.length ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-9">
                {filteredSimulations &&
                  !!filteredSimulations.length &&
                  filteredSimulations.map((item, index) => (
                    <UserSimulatorCard
                      key={item.id}
                      index={index}
                      simulator={item}
                    />
                  ))}
              </div>
            ) : (
              <EmptyListPlaceholder description="شبیه سازی در این بخش وجود ندارد" />
            )}
          </Tab>
          <Tab
            key="JSUS_InProgress"
            title="درحال تکمیل"
          >
            {filteredSimulations && !!filteredSimulations?.length ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-9">
                {filteredSimulations &&
                  !!filteredSimulations.length &&
                  filteredSimulations.map((item, index) => (
                    <UserSimulatorCard
                      key={item.id}
                      index={index}
                      simulator={item}
                    />
                  ))}
              </div>
            ) : (
              <EmptyListPlaceholder description="شبیه سازی در این بخش وجود ندارد" />
            )}
          </Tab>
          <Tab
            key="JSUS_Completed"
            title="تکمیل شده"
          >
            {filteredSimulations && !!filteredSimulations?.length ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-9">
                {filteredSimulations &&
                  !!filteredSimulations.length &&
                  filteredSimulations.map((item, index) => (
                    <UserSimulatorCard
                      key={item.id}
                      index={index}
                      simulator={item}
                    />
                  ))}
              </div>
            ) : (
              <EmptyListPlaceholder description="شبیه سازی در این بخش وجود ندارد" />
            )}
          </Tab>
          <Tab
            key="userWantsEvaluator"
            title="دارای ارزیاب"
          >
            {filteredSimulations && !!filteredSimulations?.length ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-9">
                {filteredSimulations &&
                  !!filteredSimulations.length &&
                  filteredSimulations.map((item, index) => (
                    <UserSimulatorCard
                      key={item.id}
                      index={index}
                      simulator={item}
                    />
                  ))}
              </div>
            ) : (
              <EmptyListPlaceholder description="شبیه سازی در این بخش وجود ندارد" />
            )}
          </Tab>
        </Tabs>
        {!!page && !!pageSize && !!totalItemsCount && (
          <Pagination
            currentPage={page}
            total={Math.ceil(totalItemsCount / pageSize)}
            onPageChange={setPage}
          />
        )}
      </div>
      {/*<div className="flex flex-col gap-6 w-full md:w-[250px]">*/}
      {/*<div className="py-6 px-4 rounded-lg bg-white flex flex-col gap-3 sticky top-0">*/}
      {/*  <div className="flex flex-col gap-3 items-center">*/}
      {/*    <Tooltip content="برای تغییر آواتار کلیک کنید">*/}
      {/*      <div*/}
      {/*        role="button"*/}
      {/*        onClick={() => setIsOpenUpdateAvatarModal(true)}*/}
      {/*      >*/}
      {/*        <img*/}
      {/*          alt="user profile"*/}
      {/*          className="rounded-full mx-auto size-[100px]"*/}
      {/*          height={100}*/}
      {/*          src={*/}
      {/*            user?.imageId*/}
      {/*              ? fileAddress(user?.imageId)*/}
      {/*              : user?.sex === 'S_Male'*/}
      {/*                ? '/images/placeholders/man-placeholder.webp'*/}
      {/*                : user?.sex === 'S_Female'*/}
      {/*                  ? '/images/placeholders/woman-placeholder.webp'*/}
      {/*                  : '/images/placeholders/portrait.webp'*/}
      {/*          }*/}
      {/*          width={100}*/}
      {/*        />*/}
      {/*      </div>*/}
      {/*    </Tooltip>*/}
      {/*    <div className="flex flex-col gap-2">*/}
      {/*      <p className="font-medium text-base leading-6">{getFullName(user?.firstName, user?.lastName)}</p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <Button*/}
      {/*    fullWidth*/}
      {/*    to="/auth/profile"*/}
      {/*  >*/}
      {/*    ویرایش اطلاعات*/}
      {/*  </Button>*/}
      {/*</div>*/}
      {/*<div className="rounded-lg flex flex-col justify-center gap-6 bg-gradient-secondary py-10 px-6">*/}
      {/*  <div className="flex flex-col gap-4 text-white">*/}
      {/*    <p className="font-bold text-[20px] leading-7">خودت را با رغبت سنجی از سردرگمی نجات بده</p>*/}
      {/*    <p className="text-xs leading-6">به کمک رغبت سنجی مهارت ها و استعداد های خودت رو شناسایی کن</p>*/}
      {/*  </div>*/}
      {/*  <Button*/}
      {/*    fullWidth*/}
      {/*    color="secondary"*/}
      {/*    className="bg-white"*/}
      {/*  >*/}
      {/*    <p className="text-secondary">شروع رغبت سنجی</p>*/}
      {/*  </Button>*/}
      {/*</div> */}
      {/*</div>*/}
      {/*<UpdateAvatarModal*/}
      {/*  isOpen={isOpenUpdateAvatarModal}*/}
      {/*  setIsOpen={setIsOpenUpdateAvatarModal}*/}
      {/*/>*/}
    </section>
  )
}

export default Simulators

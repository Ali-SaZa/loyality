'use client'
import { Input } from '@heroui/input'
import React, { useEffect, useState } from 'react'

import Button from '@/components/formElements/Button'
import Pagination from '@/components/utils/Pagination'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon'
import FilterIcon from '@/components/icons/FilterIcon'
import SearchIcon from '@/components/icons/SearchIcon'
import SimulatorCard from '@/components/card/SimulatorCard'
import IntroHeader from '@/components/ui/IntroHeader'
import useWindowSize from '@/hooks/useWindowSize'
import { GET_ALL_SIMULATIONS } from '@/services/simulations'
import { debounce, isEmptyObject } from '@/helpers'
import SimulatorSortModal from '@/components/modals/SimulatorSortModal'
import useLoading from '@/hooks/useLoading'
import SimulatorFilterModal from '@/components/modals/SimulatorFilterModal'
import EmptyListPlaceholder from '@/components/utils/EmptyListPlaceholder'
import { ApiWithParams } from '@/types'

export interface SortItem {
  name: string
  sort: 'createdAt' | '-createdAt' | 'score'
}

export interface filterItem {
  hasEmployment?: boolean
  jobCategoryIds?: string[]
  organizationIds?: string[]
}

const Simulators = () => {
  const { width } = useWindowSize()
  const { setLoading } = useLoading()
  const [search, setSearch] = useState('')
  const [isOpenSortModal, setIsOpenSortModal] = useState(false)
  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false)
  const [sort, setSort] = useState<SortItem>()
  const [filter, setFilter] = useState<filterItem>()
  const [searchedSimulators, setSearchedSimulators] = useState<any>([])
  const [totalItemsCount, setTotalItemsCount] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)

  const scrollToTop = () => {
    window.scrollTo({ top: 250, behavior: 'smooth' })
  }

  const handleSearch = async (value: string) => {
    try {
      setLoading(true)
      const params = {
        filters: {
          title: value,
        },
      }

      await fetchSimulations(params)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = debounce(handleSearch, 500)

  const handleSearchInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value

    setSearch(searchValue)
    if (searchValue !== '') {
      debouncedSearch(searchValue)
    } else {
      setLoading(true)
      await fetchSimulations()
      setLoading(false)
    }
  }

  const fetchSimulations = async (params?: ApiWithParams) => {
    try {
      setLoading(true)
      const defaultParams = {
        page,
        pageSize,
      }
      const response = await GET_ALL_SIMULATIONS(params ?? defaultParams)

      setSearchedSimulators(response.data.data)
      setTotalItemsCount(Number(response.data.response.totalItemsCount))
      scrollToTop()
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSortSimulations = async () => {
    try {
      setLoading(true)
      const params = {
        sort: sort?.sort,
      }

      await fetchSimulations(params)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const transformedFilter = {
      organizationId: filter?.organizationIds?.join(','),
      jobCategoryId: filter?.jobCategoryIds?.join(','),
      hasEmployment: filter?.hasEmployment,
    }

    const params = {
      page,
      pageSize,
      sort: sort?.sort,
      filters: {
        ...transformedFilter,
      },
    }

    fetchSimulations(params)
  }, [page])

  useEffect(() => {
    if (sort) {
      handleSortSimulations()
    } else {
      fetchSimulations()
    }
  }, [sort])

  const handleSubmitFilter = async () => {
    try {
      if (filter) {
        setLoading(true)

        if (!filter?.hasEmployment) {
          delete filter?.hasEmployment
        }

        const transformedFilter = {
          organizationId: filter?.organizationIds?.join(','),
          jobCategoryId: filter?.jobCategoryIds?.join(','),
          hasEmployment: filter?.hasEmployment,
        }

        const params = {
          filters: {
            ...transformedFilter,
          },
        }

        await fetchSimulations(params)
        setIsOpenFilterModal(false)
      } else {
        await fetchSimulations()
        setIsOpenFilterModal(false)
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="pt-16">
      {(width >= 768 || !search) && (
        <IntroHeader
          desktopHeight={321}
          mobileHeight={252}
          url="/images/simulators-header.webp"
        >
          <div className="text-text-dark text-4xl font-bold leading-[4rem] md:leading-10">تمامی شبیه ساز ها</div>
          <div className="text-text-dark text-xl align-text-center mt-6 mb-9">{totalItemsCount} شبیه ساز از هزاران شرکت معتبر</div>
        </IntroHeader>
      )}
      <div className="py-16 pt-0 container">
        <div className={`relative ${search && width < 768 ? 'bottom-4 mt-10' : 'bottom-6'} z-30 md:w-[50%] mx-auto rounded-xl shadow-xl`}>
          <Input
            labelPlacement="outside"
            placeholder="جست و جو شبیه ساز"
            radius="sm"
            size="lg"
            startContent={<SearchIcon className="size-4" />}
            type="text"
            value={search}
            onChange={handleSearchInputChange}
          />
        </div>

        <div className="flex items-center gap-[10px] mb-6 mt-4">
          <Button
            iconEnd={<ChevronRightIcon className="size-4 text-primary rotate-90" />}
            variant="bordered"
            onClick={() => setIsOpenSortModal(true)}
          >
            {sort ? sort.name : 'ترتیب'}
          </Button>
          <Button
            iconStart={<FilterIcon className="size-5 text-primary" />}
            variant="bordered"
            onClick={() => setIsOpenFilterModal(true)}
          >
            {filter && !isEmptyObject(filter) ? `${Object.keys(filter).length} فیلتر` : 'فیلتر'}
          </Button>
        </div>
        {searchedSimulators.length ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {searchedSimulators.map((simulator: any) => (
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
      </div>
      <SimulatorSortModal
        isOpen={isOpenSortModal}
        setIsOpen={setIsOpenSortModal}
        setSort={setSort}
        sort={sort}
      />
      <SimulatorFilterModal
        filter={filter}
        isOpen={isOpenFilterModal}
        setFilter={setFilter}
        setIsOpen={setIsOpenFilterModal}
        onSubmit={handleSubmitFilter}
      />
    </section>
  )
}

export default Simulators

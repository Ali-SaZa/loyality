'use client'
import { Input } from '@heroui/input'
import React, { useEffect, useState } from 'react'

import Button from '@/components/formElements/Button'
import Pagination from '@/components/utils/Pagination'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon'
import FilterIcon from '@/components/icons/FilterIcon'
import SearchIcon from '@/components/icons/SearchIcon'
import IntroHeader from '@/components/ui/IntroHeader'
import useWindowSize from '@/hooks/useWindowSize'
import { debounce, isEmptyObject } from '@/helpers'
import SimulatorSortModal from '@/components/modals/SimulatorSortModal'
import useLoading from '@/hooks/useLoading'
import SimulatorFilterModal from '@/components/modals/SimulatorFilterModal'
import EmptyListPlaceholder from '@/components/utils/EmptyListPlaceholder'
import { GET_ALL_ORGANIZATIONS } from '@/services/organizations'
import OrganizationCard from '@/components/card/OrganizationCard'
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

const Organizations = () => {
  const { width } = useWindowSize()
  const { setLoading } = useLoading()
  const [search, setSearch] = useState('')
  const [isOpenSortModal, setIsOpenSortModal] = useState(false)
  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false)
  const [sort, setSort] = useState<SortItem>()
  const [filter, setFilter] = useState<filterItem>()
  const [searchedOrganizations, setSearchedOrganizations] = useState<any>([])
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
          organizationName: value,
        },
      }

      await fetchOrganizations(params)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = debounce(handleSearch, 500)

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value

    setSearch(searchValue)
    if (searchValue !== '') {
      debouncedSearch(searchValue)
    } else {
      fetchOrganizations()
    }
  }

  const fetchOrganizations = async (params?: ApiWithParams) => {
    try {
      setLoading(true)
      const defaultParams = {
        page,
        pageSize,
      }
      const response = await GET_ALL_ORGANIZATIONS(params ?? defaultParams)

      setSearchedOrganizations(response.data.data)
      setTotalItemsCount(Number(response.data.response.totalItemsCount))
      scrollToTop()
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSortOrganizations = async () => {
    try {
      setLoading(true)
      const params = {
        sort: sort?.sort,
      }

      await fetchOrganizations(params)
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

    fetchOrganizations(params)
  }, [page])

  useEffect(() => {
    if (sort) {
      handleSortOrganizations()
    } else {
      fetchOrganizations()
    }
  }, [sort])

  const handleSubmitFilter = async () => {
    try {
      if (filter) {
        setLoading(true)

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

        await fetchOrganizations(params)
        setIsOpenFilterModal(false)
      } else {
        await fetchOrganizations()
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
          url="/images/organizations-header.webp"
        >
          <div className="text-text-dark text-4xl font-bold leading-[4rem] md:leading-10">تمامی کسب و کار ها</div>
          <div className="text-text-dark text-xl align-text-center mt-6 mb-9">
            {totalItemsCount} کسب و کاری که میتونی کار کردن باهاشون رو اینجا تجربه کنی
          </div>
        </IntroHeader>
      )}
      <div className="py-16 pt-0 container">
        <div className={`relative ${search && width < 768 ? 'bottom-4 mt-10' : 'bottom-6'} z-30 md:w-[50%] mx-auto rounded-xl shadow-xl`}>
          <Input
            labelPlacement="outside"
            placeholder="جست و جو کسب و کار"
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
        {searchedOrganizations.length ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {searchedOrganizations.map((organization: any) => (
                <OrganizationCard
                  key={organization!.id}
                  organization={organization}
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
        noScore
        isOpen={isOpenSortModal}
        setIsOpen={setIsOpenSortModal}
        setSort={setSort}
        sort={sort}
      />
      <SimulatorFilterModal
        noEmployment
        noOrganization
        filter={filter}
        isOpen={isOpenFilterModal}
        setFilter={setFilter}
        setIsOpen={setIsOpenFilterModal}
        onSubmit={handleSubmitFilter}
      />
    </section>
  )
}

export default Organizations

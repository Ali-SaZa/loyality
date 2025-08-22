import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useDisclosure } from '@heroui/modal'
import { Checkbox } from '@heroui/checkbox'
import { cn } from '@heroui/theme'

import ChevronRightIcon from '../icons/ChevronRightIcon'

import { filterItem } from '@/app/(landing)/simulators/page'
import Modal from '@/components/modals/Modal'
import Button from '@/components/formElements/Button'
import { GET_ALL_JOB_CATEGORIES_ROOT } from '@/services/jobCategories'
import useLoading from '@/hooks/useLoading'
import { GET_ALL_ORGANIZATIONS } from '@/services/organizations'
import InfiniteScroll from '@/components/utils/InfiniteScroll'

interface SimulatorSortModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  filter?: filterItem
  setFilter: React.Dispatch<React.SetStateAction<filterItem | undefined>>
  onSubmit: () => void
  noOrganization?: boolean
  noEmployment?: boolean
}

const SimulatorFilterModal = ({
  isOpen,
  setIsOpen,
  filter,
  setFilter,
  onSubmit,
  noOrganization,
  noEmployment,
}: SimulatorSortModalProps) => {
  const { setLoading } = useLoading()
  const { onOpenChange } = useDisclosure()
  const [step, setStep] = useState(1)
  const [categoryDepth, setCategoryDepth] = useState(0)
  const [filterSection, setFilterSection] = useState<'job' | 'brand' | ''>('')
  const [rootCategories, setRootCategories] = useState<any[]>([])
  const [organizations, setOrganizations] = useState<any[]>([])
  const [organizationsPaginateDetail, setOrganizationsPaginateDetail] = useState({
    page: 1,
    pageSize: 20,
    hasMore: true,
  })

  const handleFilterChange = (field: 'hasEmployment' | 'jobCategoryIds' | 'organizationIds', value: any) => {
    // for array
    if (field === 'jobCategoryIds' || field === 'organizationIds') {
      const hasExistItem = filter?.[field]?.includes(value)

      if (hasExistItem) {
        setFilter({
          ...filter,
          [field]: filter?.[field]?.filter((item) => item !== value),
        })
      } else {
        if (filter?.[field]) {
          setFilter({
            ...filter,
            [field]: [...filter?.[field]!, value],
          })
        } else {
          setFilter({
            ...filter,
            [field]: [value],
          })
        }
      }
    }
    // for boolean
    else if (field === 'hasEmployment') {
      setFilter({
        ...filter,
        [field]: value,
      })
    }
  }

  const handleRemoveFilters = () => {
    setFilter(undefined)
  }

  const handleBackClick = () => {
    setStep((prev: number) => prev - 1)
    setCategoryDepth(0)
  }

  const handleSelectSection = (section: 'job' | 'brand') => {
    setFilterSection(section)
    setStep((prev: number) => prev + 1)
  }

  const handleClickCategory = async (id: string) => {
    try {
      if (categoryDepth < 2) {
        setLoading(true)
        const response = await GET_ALL_JOB_CATEGORIES_ROOT(id)

        setCategoryDepth((prev) => prev + 1)
        setRootCategories(response.data.jobCategories)
      } else {
        handleFilterChange('jobCategoryIds', id)
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const getRootCategories = async () => {
    try {
      setLoading(true)
      const response = await GET_ALL_JOB_CATEGORIES_ROOT()

      setRootCategories(response.data.jobCategories)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const getAllOrganizations = async () => {
    try {
      setLoading(true)

      const params = {
        page: organizationsPaginateDetail.page,
        pageSize: organizationsPaginateDetail.pageSize,
      }
      const response = await GET_ALL_ORGANIZATIONS(params)

      setOrganizations((prev) => [...prev, ...response.data.data])

      if (organizationsPaginateDetail.page * organizationsPaginateDetail.pageSize < +response.data.response.totalItemsCount) {
        const newPaginate = {
          page: organizationsPaginateDetail.page + 1,
          pageSize: organizationsPaginateDetail.pageSize,
          hasMore: true,
        }

        setOrganizationsPaginateDetail(newPaginate)
      } else {
        const newPaginate = {
          page: organizationsPaginateDetail.page,
          pageSize: organizationsPaginateDetail.pageSize,
          hasMore: false,
        }

        setOrganizationsPaginateDetail(newPaginate)
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (step === 2 && filterSection === 'job') {
      getRootCategories()
    } else if (step === 2 && filterSection === 'brand') {
      // getAllOrganizations()
    }
  }, [step, filterSection])

  return (
    <Modal
      footerChildren={
        <>
          <Button
            className="grow"
            onClick={onSubmit}
          >
            تایید و مشاهده
          </Button>

          <Button
            variant="light"
            onClick={handleRemoveFilters}
          >
            حذف فیلتر
          </Button>
        </>
      }
      footerClassName="border-none"
      headerChildren={
        step > 1 && (
          <Button
            iconOnly
            className="rounded-full ml-2"
            color="default"
            size="sm"
            variant="bordered"
            onClick={handleBackClick}
          >
            <ChevronRightIcon className="size-4 text-text" />
          </Button>
        )
      }
      headerClassName="border-none font-semibold"
      isOpen={isOpen}
      title="فیلتر"
      onClose={() => setIsOpen(false)}
      onOpenChange={onOpenChange}
    >
      <div>
        {step === 1 && (
          <motion.div
            animate={{ x: 0, opacity: 1 }}
            className="grid grid-cols-1 gap-3"
            exit={{ x: 200, opacity: 0 }}
            initial={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`bg-background-10 hover:bg-background-50 rounded-lg py-3 px-4 text-text-dark flex items-center justify-between cursor-pointer`}
              role="button"
              onClick={() => handleSelectSection('job')}
            >
              <p>بر اساس مشاغل</p>
              <ChevronRightIcon className="size-4 rotate-180 text-text" />
            </div>
            {!noOrganization && (
              <div
                className={`bg-background-10 hover:bg-background-50 rounded-lg py-3 px-4 text-text-dark flex items-center justify-between cursor-pointer`}
                role="button"
                onClick={() => handleSelectSection('brand')}
              >
                <p>بر اساس سازمان</p>
                <ChevronRightIcon className="size-4 rotate-180 text-text" />
              </div>
            )}
            {!noEmployment && (
              <Checkbox
                className="mt-2"
                color="primary"
                isSelected={filter?.hasEmployment}
                onValueChange={() => handleFilterChange('hasEmployment', !filter?.hasEmployment)}
              >
                فقط مواردی که آماده برای جذب نیرو هستند.
              </Checkbox>
            )}
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-4"
            exit={{ x: 200, opacity: 0 }}
            initial={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filterSection === 'job' &&
              rootCategories?.map((item: any) => (
                <div
                  key={item.id}
                  className={`bg-background-10 hover:bg-background-50 rounded-lg py-3 px-4 text-text-dark flex items-center justify-between cursor-pointer`}
                  role="button"
                  onClick={() => handleClickCategory(item.id)}
                >
                  <div className="flex items-center gap-1">
                    <Checkbox
                      color="primary"
                      isSelected={filter?.jobCategoryIds ? filter.jobCategoryIds?.includes(item.id) : false}
                      onValueChange={() => handleFilterChange('jobCategoryIds', item.id)}
                    />
                    <p>{item.title}</p>
                  </div>
                  {categoryDepth < 2 && <ChevronRightIcon className="size-4 rotate-180 text-text" />}
                </div>
              ))}
            {filterSection === 'brand' && (
              <div className="flex flex-col gap-6 my-4">
                {organizations?.map((item: any) => (
                  <Checkbox
                    key={item.id}
                    aria-label={'test'}
                    classNames={{
                      base: cn(
                        'flex max-w-[99%]',
                        'hover:bg-background-50 items-center justify-start',
                        'cursor-pointer rounded-lg gap-1 py-3 px-4 mr-[2px] border-2',
                        'data-[selected=true]:border-primary data-[selected=true]:bg-background-50'
                      ),
                    }}
                    isSelected={filter?.organizationIds ? filter.organizationIds?.includes(item.id) : false}
                    onValueChange={() => handleFilterChange('organizationIds', item.id)}
                  >
                    <div className="w-full flex justify-between gap-2">
                      <p>{item.organizationName}</p>
                    </div>
                  </Checkbox>
                ))}
                <InfiniteScroll
                  fetchMoreData={getAllOrganizations}
                  hasMore={organizationsPaginateDetail.hasMore}
                />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Modal>
  )
}

export default SimulatorFilterModal

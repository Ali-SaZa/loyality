'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Selection, SortDescriptor, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown'
import { Input } from '@nextui-org/input'
import { Pagination } from '@nextui-org/pagination'
import { Button as NextUiButton } from '@nextui-org/button'
import qs from 'qs'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import toast from 'react-hot-toast'
import { useDisclosure } from '@nextui-org/modal'
import { Accordion, AccordionItem } from '@nextui-org/accordion'
import { Select, SelectItem } from '@nextui-org/select'
import { Chip } from '@nextui-org/chip'

import AngleDownIcon from '../icons/AngleDownIcon'
import SearchAltIcon from '../icons/SearchAltIcon'
import AngleLeftIcon from '../icons/AngleLeftIcon'
import DotLoadingIcon from '../icons/DotLoadingIcon'
import FilterIcon from '../icons/FilterIcon'
import Modal from '../modals/Modal'

import axiosInstance from '@/config/axios'
import { convertPersianToEnglish, convertToISOFormat, isEmptyObject } from '@/helpers'
import Button from '@/components/formElements/Button'
import useAlertModal from '@/hooks/useAlertModal'

type ChildrenType = Record<string, (data: any, cellValue: any) => React.ReactNode>

interface CustomTableProps {
  columns: any[]
  staticData?: any[]
  initialVisibleColumns?: string[]
  selectionMode?: 'single' | 'multiple' | 'none'
  url?: string
  children?: ChildrenType | never[]
  searchField?: string
  urlParams?: ApiWithParams
}

const PaginatedList = ({
  columns = [],
  staticData = [],
  initialVisibleColumns = [],
  selectionMode = 'none',
  url,
  children = {},
  searchField,
  urlParams = {
    page: 1,
    pageSize: 20,
    sort: '',
    filters: {},
  },
}: CustomTableProps) => {
  type DataType = (typeof data)[0]

  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure()
  const { showModal } = useAlertModal()
  const [data, setData] = useState<any[]>(staticData)
  const [filters, setFilters] = useState<any>({})
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(initialVisibleColumns))
  const [page, setPage] = useState(urlParams.page || 1)
  const [rowsPerPage, setRowsPerPage] = useState(urlParams.pageSize || 20)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: searchField ? searchField : 'createdAt',
    direction: 'ascending',
  })

  // استفاده از useRef برای تشخیص اولین اجرا
  const isFirstRender = useRef(true)

  const handleFetch = async (params?: ApiWithParams) => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get(url!, {
        params: params ? params : urlParams,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
      })

      setData(response.data.data)
      setTotalItems(response.data.response.totalItemsCount)
      if (initialVisibleColumns.length === 0 && response?.data?.data?.length) {
        setVisibleColumns(new Set([...Object.keys(response.data.data[0]), 'actions']))
      }
    } catch (error: any) {
      console.log('error', error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (url) {
      const params = {
        ...urlParams,
        page,
        pageSize: rowsPerPage,
      }

      handleFetch(params)
    }
  }, [url, page])

  const handleSort = async () => {
    const sortString = sortDescriptor.direction === 'ascending' ? sortDescriptor.column! : `-${sortDescriptor.column!}`
    const params = {
      ...urlParams,
      page,
      pageSize: rowsPerPage,
      sort: sortString as string,
    }

    await handleFetch(params)
  }

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all' || visibleColumns.size === 0) return columns

    return columns.filter((column) => Array.from(visibleColumns).includes(column.field))
  }, [visibleColumns])

  const pages = Math.ceil(totalItems / rowsPerPage)

  useEffect(() => {
    // چک کردن اینکه آیا اولین اجرا است یا نه
    if (isFirstRender.current) {
      isFirstRender.current = false

      return // از اجرای درخواست در بار اول جلوگیری می‌کند
    }

    handleSort()
  }, [sortDescriptor])

  // const renderCell = useCallback((item: DataType, columnKey: React.Key) => {
  //   const cellValue = item[columnKey as keyof DataType]
  //   if (children && typeof children === 'object' && children[columnKey as string]) {
  //     return children[columnKey as string](item, cellValue)
  //   }
  //   return item[columnKey as string]
  // }, [])

  const renderCell = useCallback(
    (item: DataType, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof DataType]

      // Ensure children is of type ChildrenType before using it
      if (children && typeof children === 'object' && !(children instanceof Array) && (columnKey as string) in children) {
        const columnKeyString = columnKey as keyof typeof children

        return children[columnKeyString](item, cellValue)
      }

      return cellValue
    },
    [children]
  )

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1)
    }
  }, [page, pages])

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
  }, [page])

  const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }, [])

  const handleClearFilter = () => {
    setFilters({})
  }

  const handleRemoveFilter = (field: string) => {
    setFilters((prevFilters: any) => {
      const newFilters = { ...prevFilters }

      delete newFilters[field]

      return newFilters
    })
  }

  const handleSetFilter = (field: string, value: string | number, nestedField?: string) => {
    setFilters((prevFilters: any) => {
      if (nestedField) {
        return {
          ...prevFilters,
          [field]: {
            ...prevFilters[field],
            [nestedField]: value,
          },
        }
      } else {
        return {
          ...prevFilters,
          [field]: value,
        }
      }
    })
  }

  const isNestedFilter = (value: any): value is { from: string; to: string } => {
    return typeof value === 'object' && value !== null && 'from' in value && 'to' in value
  }

  const createFilterObject = (): Record<string, string> => {
    const result: Record<string, string> = {}

    Object.entries(filters).forEach(([key, value]) => {
      if (isNestedFilter(value)) {
        // اگر مقدار `nested` باشد، مقادیر را به رشته‌ای با کاما جدا کنید
        result[key] = `${value.from},${value.to}` // استفاده از template string
      } else if (typeof value === 'string') {
        // اگر مقدار ساده باشد و از نوع string باشد
        result[key] = value // مقدار به عنوان string قرار می‌گیرد
      } else {
        // در غیر این صورت می‌توانید مقداری خالی یا مقداری پیش‌فرض قرار دهید
        result[key] = '' // یا هر مقدار پیش‌فرض دیگری که می‌خواهید
      }
    })

    return result // بازگشت آبجکت فیلتر نهایی
  }

  const runFilters = async () => {
    const filterObject = createFilterObject()
    const params = {
      ...urlParams,
      page,
      pageSize: rowsPerPage,
      filters: {
        ...urlParams.filters,
        ...filterObject,
      },
    }

    await handleFetch(params)
    setPage(1)
    onClose()
  }

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex gap-3">
            <Button
              className="font-normal rounded-xl "
              color="default"
              iconStart={<FilterIcon className="size-5" />}
              variant="flat"
              onClick={onOpen}
            >
              فیلتر ({Object.keys(filters).length})
            </Button>
            <Dropdown>
              <DropdownTrigger>
                <NextUiButton
                  endContent={<AngleDownIcon className="size-5 text-text" />}
                  variant="flat"
                >
                  فیلتر عناوین
                </NextUiButton>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => {
                  if (column?.visibleForTitleFilter === false) return null

                  return <DropdownItem key={column.field}>{column.label}</DropdownItem>
                })}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    )
  }, [visibleColumns, onRowsPerPageChange, data.length])

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        {selectionMode !== 'none' && (
          <div className="flex items-center text-nowrap gap-2 text-small text-default-400">
            <span>{selectedKeys === 'all' ? 'تمامی سطر ها انتخاب شدند' : `${selectedKeys.size} تا از ${data.length} انتخاب شدند`}</span>
            <span>|</span>
            <span>تعداد کل: {data.length}</span>
          </div>
        )}
        {!!page && !!pages && (
          <>
            <Pagination
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={setPage}
            />
            <div className="hidden sm:flex w-[30%] justify-end gap-2">
              <Button
                color="default"
                disabled={page === 1}
                iconStart={<AngleLeftIcon className="size-6 rotate-180 text-text" />}
                size="sm"
                variant="flat"
                onClick={onPreviousPage}
              >
                قبلی
              </Button>
              <Button
                color="default"
                disabled={page === pages}
                iconEnd={<AngleLeftIcon className="size-6 text-text" />}
                size="sm"
                variant="flat"
                onClick={onNextPage}
              >
                بعدی
              </Button>
            </div>
          </>
        )}
      </div>
    )
  }, [selectedKeys, data.length, page, pages])

  return (
    <>
      <Table
        isHeaderSticky
        isStriped
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={
          {
            // wrapper: 'max-h-[382px]',
          }
        }
        selectedKeys={selectedKeys}
        selectionMode={selectionMode}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.field}
              align={column.field === 'actions' ? 'end' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={<p>هیچ داده ای یافت نشد</p>}
          isLoading={isLoading}
          items={data}
          loadingContent={
            isLoading && (
              <div className="w-full h-full bg-background-20/50 flex items-center justify-center">
                <div className="flex items-center gap-1 bg-white p-4 rounded-xl shadow-md ">
                  <p>درحال بارگزاری</p>
                  <DotLoadingIcon />
                </div>
              </div>
            )
          }
          loadingState={isLoading ? 'loading' : 'idle'}
        >
          {(item) => <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
        </TableBody>
      </Table>
      <Modal
        acceptBtnText="تایید"
        footerClassName="z-[-1]"
        isOpen={isOpen}
        size="lg"
        title="فیلتر ها"
        onAccept={runFilters}
        onOpenChange={onOpenChange}
      >
        {!isEmptyObject(filters) && (
          <div className="px-2 flex gap-2 flex-wrap">
            {Object.keys(filters)?.map((filterKey: any, index: number) => (
              <Chip
                key={index}
                color="primary"
                variant="flat"
                onClose={() => handleRemoveFilter(filterKey)}
              >
                {columns?.find((column) => column.field === filterKey)?.label}
              </Chip>
            ))}
            <Chip
              className="cursor-pointer"
              color="danger"
              variant="solid"
              onClick={() => showModal('برای حذف همه فیلتر ها مطمعن هستید؟', handleClearFilter)}
            >
              حذف همه
            </Chip>
          </div>
        )}
        <div className="py-4">
          <Accordion
            itemClasses={{
              base: 'shadow-none bg-background-10',
              content: 'pb-4',
              title: 'text-sm font-normal',
            }}
            variant="splitted"
          >
            {columns
              .filter((column) => column?.filterable)
              .map((column, index) => (
                <AccordionItem
                  key={index}
                  aria-label={column.label}
                  title={column.label}
                >
                  {(!column.type || column.type === 'text') && (
                    <Input
                      fullWidth
                      isClearable
                      aria-label={column.label}
                      className="shadow-none"
                      placeholder={`جستجو با ${column.label}`}
                      size="md"
                      startContent={<SearchAltIcon />}
                      value={filters[column.field]}
                      variant="underlined"
                      onClear={() => handleSetFilter(column.field, '')}
                      onValueChange={(value) => handleSetFilter(column.field, convertPersianToEnglish(value))}
                    />
                  )}
                  {column.type === 'number' && (
                    <Input
                      fullWidth
                      isClearable
                      aria-label={column.label}
                      className="shadow-none"
                      placeholder={`جستجو با ${column.label}`}
                      size="md"
                      startContent={<SearchAltIcon />}
                      type="number"
                      value={filters[column.field]}
                      variant="underlined"
                      onClear={() => handleSetFilter(column.field, '')}
                      onValueChange={(value) => handleSetFilter(column.field, Number(convertPersianToEnglish(value)))}
                    />
                  )}
                  {column.type === 'inputFromTo' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        fullWidth
                        isClearable
                        aria-label={column.label}
                        className="shadow-none"
                        label={`از ${column.label}`}
                        size="md"
                        startContent={<SearchAltIcon />}
                        value={filters[column.field]?.from}
                        variant="underlined"
                        onClear={() => handleSetFilter(column.field, '', 'from')}
                        onValueChange={(value) => handleSetFilter(column.field, convertPersianToEnglish(value), 'from')}
                      />
                      <Input
                        fullWidth
                        isClearable
                        aria-label={column.label}
                        className="shadow-none"
                        label={`تا ${column.label}`}
                        size="md"
                        startContent={<SearchAltIcon />}
                        value={filters[column.field]?.to}
                        variant="underlined"
                        onClear={() => handleSetFilter(column.field, '', 'to')}
                        onValueChange={(value) => handleSetFilter(column.field, convertPersianToEnglish(value), 'to')}
                      />
                    </div>
                  )}
                  {column.type === 'select' && column?.filterItems?.length && (
                    <Select
                      fullWidth
                      aria-label={column.label}
                      placeholder={`انتخاب ${column.label}`}
                      size="md"
                      startContent={<SearchAltIcon />}
                      variant="underlined"
                      onChange={(event) => handleSetFilter(column.field, event.target.value)}
                    >
                      {column.filterItems.map((item: any) => (
                        <SelectItem key={item.code}>{item.name}</SelectItem>
                      ))}
                    </Select>
                  )}
                  {column.type === 'date' && (
                    <DatePicker
                      calendar={persian}
                      calendarPosition="bottom-right"
                      containerStyle={{
                        width: '100%',
                      }}
                      format="YYYY/MM/DD"
                      locale={persian_fa}
                      maxDate={new DateObject({ calendar: persian })}
                      minDate="1300/1/1"
                      placeholder={`انتخاب ${column.label}`}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        height: '48px',
                        borderRadius: '0px',
                        background: '#f8f8f8',
                        borderColor: '#e4e4e7',
                        borderWidth: '2px',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        color: 'black',
                        padding: '0 12px',
                      }}
                      value={new Date(filters[column.field])}
                      onChange={(date) => handleSetFilter(column.field, convertToISOFormat(date)!.split('T')[0])}
                    />
                  )}
                  {column.type === 'dateFromTo' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label
                          className="text-xs"
                          htmlFor=""
                        >
                          {`از ${column.label}`}
                        </label>
                        <DatePicker
                          calendar={persian}
                          calendarPosition="bottom-right"
                          containerStyle={{
                            width: '100%',
                          }}
                          format="YYYY/MM/DD"
                          locale={persian_fa}
                          maxDate={new DateObject({ calendar: persian })}
                          minDate="1300/1/1"
                          placeholder={`از ${column.label}`}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            height: '48px',
                            borderRadius: '0px',
                            background: '#f8f8f8',
                            borderColor: '#e4e4e7',
                            borderWidth: '2px',
                            borderTop: 'none',
                            borderLeft: 'none',
                            borderRight: 'none',
                            color: 'black',
                            padding: '0 12px',
                          }}
                          value={new Date(filters[column.field]?.from)}
                          onChange={(date) => handleSetFilter(column.field, convertToISOFormat(date)!.split('T')[0], 'from')}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label
                          className="text-xs"
                          htmlFor=""
                        >
                          {`تا ${column.label}`}
                        </label>
                        <DatePicker
                          calendar={persian}
                          calendarPosition="bottom-right"
                          containerStyle={{
                            width: '100%',
                          }}
                          format="YYYY/MM/DD"
                          locale={persian_fa}
                          maxDate={new DateObject({ calendar: persian })}
                          minDate="1300/1/1"
                          placeholder={`تا ${column.label}`}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            height: '48px',
                            borderRadius: '0px',
                            background: '#f8f8f8',
                            borderColor: '#e4e4e7',
                            borderWidth: '2px',
                            borderTop: 'none',
                            borderLeft: 'none',
                            borderRight: 'none',
                            color: 'black',
                            padding: '0 12px',
                          }}
                          value={new Date(filters[column.field]?.to)}
                          onChange={(date) => handleSetFilter(column.field, convertToISOFormat(date)!.split('T')[0], 'to')}
                        />
                      </div>
                    </div>
                  )}
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </Modal>
    </>
  )
}

export default PaginatedList

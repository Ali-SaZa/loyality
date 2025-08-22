'use client'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Selection, SortDescriptor, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown'
import { Input } from '@heroui/input'
import { Pagination } from '@heroui/pagination'
import { Button as NextUiButton } from '@heroui/button'
import qs from 'qs'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import toast from 'react-hot-toast'
import { useDisclosure } from '@heroui/modal'
import { Accordion, AccordionItem } from '@heroui/accordion'
import { Select, SelectItem } from '@heroui/select'
import { Chip } from '@heroui/chip'

import AngleDownIcon from '../icons/AngleDownIcon'
import SearchAltIcon from '../icons/SearchAltIcon'
import AngleLeftIcon from '../icons/AngleLeftIcon'
import DotLoadingIcon from '../icons/DotLoadingIcon'
import Modal from '../modals/Modal'

import axiosInstance from '@/config/axios'
import { convertPersianToEnglish, convertToISOFormat, downloadExcel, isEmptyObject } from '@/helpers'
import Button from '@/components/formElements/Button'
import useAlertModal from '@/hooks/useAlertModal'
import TrashIcon from '@/components/icons/TrashIcon'
import ArrowsVIcon from '@/components/icons/ArrowsVIcon'
import { ApiWithParams, PaginationListColumnType } from '@/types'

type ChildrenType = Record<string, (data: any, cellValue: any) => React.ReactNode>

interface CustomTableProps {
  columns: PaginationListColumnType[]
  staticData?: any[]
  initialVisibleColumns?: string[]
  selectionMode?: 'single' | 'multiple' | 'none'
  url?: string
  children?: ChildrenType | never[]
  searchField?: string
  urlParams?: ApiWithParams
  hasDynamicButton?: boolean
  dynamicButtonText?: string
  onDynamicButtonClick?: () => void
  dynamicTopSection?: React.ReactNode
  filterPrefix?: string
}

const PaginatedList = forwardRef(
  (
    {
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
      hasDynamicButton,
      dynamicButtonText = 'افزودن',
      onDynamicButtonClick,
      dynamicTopSection,
      filterPrefix,
    }: CustomTableProps,
    ref
  ) => {
    type DataType = (typeof data)[0]

    const rowsPerPageOptions = [
      {
        key: 20,
        label: '20 ردیف',
      },
      {
        key: 30,
        label: '30 ردیف',
      },
      {
        key: 45,
        label: '45 ردیف',
      },
      {
        key: 50,
        label: '50 ردیف',
      },
      {
        key: 100,
        label: '100 ردیف',
      },
    ]

    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure()
    const { showAlert } = useAlertModal()

    const [filtersForceRender, setFiltersForceRender] = useState(1)
    const [data, setData] = useState<any[]>(staticData)
    const [filters, setFilters] = useState<any>({})
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
    const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(initialVisibleColumns))
    const [page, setPage] = useState(urlParams.page || 1)
    const [rowsPerPage, setRowsPerPage] = useState(urlParams.pageSize || rowsPerPageOptions[0].key)
    const [totalItems, setTotalItems] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
      column: searchField ? searchField : 'createdAt',
      direction: 'ascending',
    })

    // استفاده از useRef برای تشخیص اولین اجرا
    const isFirstRender = useRef(true)

    // Exposing the function to parent or other components
    useImperativeHandle(ref, () => ({
      exelReport,
      filters,
    }))

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
    }, [url, page, rowsPerPage])

    useEffect(() => {
      if (staticData?.length) {
        setData(staticData)
        setTotalItems(staticData.length)
      }
    }, [staticData])

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
      return typeof value === 'object' && value !== null && ('from' in value || 'to' in value)
    }

    const createFilterObject = (): Record<string, string> => {
      const result: Record<string, string> = {}

      Object.entries(filters).forEach(([key, value]) => {
        if (value === 'null' || value === '') {
          // حذف فیلترهای خالی یا null
          return
        }

        if (isNestedFilter(value)) {
          let filterString = ''

          if (value.from) {
            filterString += value.from
          }

          if (value.to) {
            if (value.from) {
              filterString += `,${value.to}`
            } else {
              filterString += `,${value.to}` // کاما قبل از to اگر from وجود نداشت
            }
          } else if (value.from) {
            filterString += ',' // کاما بعد از from اگر to وجود نداشت
          }

          if (filterString !== '') {
            result[key] = filterString
          }
        } else if (typeof value === 'string') {
          result[key] = value
        }
      })

      return result
    }

    const preparingFilter = (resultType?: number) => {
      const filterObject = createFilterObject()
      let params: { [p: string]: any } = {
        ...urlParams,
        page,
        pageSize: rowsPerPage,
        filters: {
          ...urlParams.filters,
          ...filterObject,
        },
      }

      // اگر resultType وجود داشت، آن را به params اضافه کن
      if (resultType !== undefined) {
        params.resultType = resultType
      }

      // اگر filterPrefix وجود داشت، کلیدها را با prefix به‌روز کن
      if (filterPrefix) {
        params = Object.fromEntries(Object.entries(params).map(([key, value]) => [`${filterPrefix}.${key}`, value]))
      }

      return params
    }

    const runFilters = async () => {
      await handleFetch(preparingFilter())
      setFiltersForceRender((prev) => prev + 1)
      setPage(1)
      onClose()
    }

    const exelReport = async (fileName: string, newUrl: string) => {
      setIsLoading(true)

      const params = preparingFilter(1)

      const response = await axiosInstance.get(newUrl || url!, {
        params: params,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
      })

      downloadExcel(response.data.response.fileData, fileName)

      setIsLoading(false)
    }

    const topContent = useMemo(() => {
      return (
        <div className="flex flex-wrap lg:flex-row gap-2 items-center justify-between">
          <div className="flex justify-between gap-3 items-end">
            <div className="flex gap-3">
              {/*<Button*/}
              {/*  className="font-normal rounded-xl "*/}
              {/*  color="default"*/}
              {/*  iconStart={<FilterIcon className="size-5" />}*/}
              {/*  variant="flat"*/}
              {/*  onClick={onOpen}*/}
              {/*>*/}
              {/*  فیلتر ({Object.keys(filters).length})*/}
              {/*</Button>*/}
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
          <div className="flex flex-col md:flex-row items-center gap-2">
            {dynamicTopSection}
            {hasDynamicButton && <Button onClick={onDynamicButtonClick}>{dynamicButtonText}</Button>}
          </div>
        </div>
      )
    }, [visibleColumns, onRowsPerPageChange, data.length])

    const bottomContent = useMemo(() => {
      return (
        <div className="py-2 px-2 flex flex-col lg:flex-row gap-2 justify-between items-center">
          {selectionMode !== 'none' && (
            <div className="flex items-center text-nowrap gap-2 text-small text-default-400">
              <span>{selectedKeys === 'all' ? 'تمامی سطر ها انتخاب شدند' : `${selectedKeys.size} تا از ${data.length} انتخاب شدند`}</span>
              <span>|</span>
              <span>تعداد کل: {data.length}</span>
            </div>
          )}
          {rowsPerPage && (
            <div className="text-nowrap flex items-center gap-1 w-full lg:w-[20%]">
              <span>نمایش </span>
              <Select
                aria-label="Rows per page"
                items={rowsPerPageOptions}
                selectedKeys={[String(rowsPerPage)]}
                variant="bordered"
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
              >
                {(row) => (
                  <SelectItem
                    key={row.key}
                    textValue={row.label}
                  >
                    {row.label}
                  </SelectItem>
                )}
              </Select>
              <span>از {totalItems}</span>
            </div>
          )}
          {!!page && !!pages && (
            <Pagination
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={setPage}
            />
          )}
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
        </div>
      )
    }, [selectedKeys, data.length, page, pages])

    return (
      <>
        <button
          className="hidden"
          id="runFilterPrivateButton"
          onClick={runFilters}
        />
        <Table
          // key={filtersForceRender}
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
          // onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.field}
                align={column.field === 'actions' ? 'end' : 'start'}
                // allowsSorting={column.sortable}
                maxWidth={column?.maxWidth}
                minWidth={column?.minWidth}
                width={column?.width}
                onClick={(e) => {
                  const target = e.target as HTMLElement

                  if (target.tagName === 'INPUT') {
                    target.focus()
                  }
                }}
              >
                <div className="flex flex-col gap-2 py-2">
                  <div className="flex items-center gap-1">
                    <p>{column.label}</p>
                    {column?.sortable && (
                      <Button
                        key={sortDescriptor.direction}
                        iconOnly
                        color="default"
                        size="sm"
                        variant="light"
                        onClick={() =>
                          setSortDescriptor((prev) => ({
                            column: column.field,
                            direction: prev.direction === 'ascending' ? 'descending' : 'ascending',
                          }))
                        }
                      >
                        <ArrowsVIcon className={`size-4 text-text ${sortDescriptor.direction === 'ascending' ? 'rotate-180' : ''}`} />
                      </Button>
                    )}
                  </div>
                  {(!column.type || column.type === 'text') && column?.filterable && (
                    <Input
                      fullWidth
                      isClearable
                      aria-label={column.label}
                      className="shadow-none"
                      size="sm"
                      value={filters[column.field]}
                      variant="bordered"
                      onClear={() => {
                        handleSetFilter(column.field, '')
                        setTimeout(() => {
                          document.getElementById('runFilterPrivateButton')?.click()
                        }, 50)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setTimeout(() => {
                            document.getElementById('runFilterPrivateButton')?.click()
                          }, 50)
                        }
                      }}
                      onValueChange={(value) => handleSetFilter(column.field, convertPersianToEnglish(value))}
                    />
                  )}
                  {column.type === 'number' && column?.filterable && (
                    <Input
                      fullWidth
                      isClearable
                      aria-label={column.label}
                      className="shadow-none"
                      size="sm"
                      type="number"
                      value={filters[column.field]}
                      variant="bordered"
                      onClear={() => {
                        handleSetFilter(column.field, '')
                        setTimeout(() => {
                          document.getElementById('runFilterPrivateButton')?.click()
                        }, 50)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setTimeout(() => {
                            document.getElementById('runFilterPrivateButton')?.click()
                          }, 50)
                        }
                      }}
                      onValueChange={(value) => handleSetFilter(column.field, Number(convertPersianToEnglish(value)))}
                    />
                  )}
                  {column.type === 'inputFromTo' && column?.filterable && (
                    <div className="flex flex-col gap-2">
                      <Input
                        fullWidth
                        isClearable
                        aria-label={column.label}
                        className="shadow-none"
                        placeholder={`از ${column.label}`}
                        size="sm"
                        value={filters[column.field]?.from}
                        variant="bordered"
                        onClear={() => {
                          handleSetFilter(column.field, '', 'from')
                          setTimeout(() => {
                            document.getElementById('runFilterPrivateButton')?.click()
                          }, 50)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setTimeout(() => {
                              document.getElementById('runFilterPrivateButton')?.click()
                            }, 50)
                          }
                        }}
                        onValueChange={(value) => handleSetFilter(column.field, convertPersianToEnglish(value), 'from')}
                      />
                      <Input
                        fullWidth
                        isClearable
                        aria-label={column.label}
                        className="shadow-none"
                        placeholder={`تا ${column.label}`}
                        size="sm"
                        value={filters[column.field]?.to}
                        variant="bordered"
                        onClear={() => {
                          handleSetFilter(column.field, '', 'to')
                          setTimeout(() => {
                            document.getElementById('runFilterPrivateButton')?.click()
                          }, 50)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setTimeout(() => {
                              document.getElementById('runFilterPrivateButton')?.click()
                            }, 50)
                          }
                        }}
                        onValueChange={(value) => handleSetFilter(column.field, convertPersianToEnglish(value), 'to')}
                      />
                    </div>
                  )}
                  {column.type === 'select' && column?.filterItems?.length && column?.filterable && (
                    <Select
                      fullWidth
                      aria-label={column.label}
                      size="sm"
                      variant="bordered"
                      onChange={(event) => {
                        handleSetFilter(column.field, event.target.value)
                        setTimeout(() => {
                          document.getElementById('runFilterPrivateButton')?.click()
                        }, 50)
                      }}
                    >
                      {column.filterItems.map((item: any) => (
                        <SelectItem key={item.code}>{item.name}</SelectItem>
                      ))}
                    </Select>
                  )}
                  {column.type === 'date' && column?.filterable && (
                    <div className="flex items-center gap-1">
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
                          height: '32px',
                          borderRadius: '8px',
                          background: '#f4f4f5',
                          borderColor: '#e4e4e7',
                          borderWidth: '2px',
                          color: 'black',
                          padding: '0 12px',
                        }}
                        value={new Date(filters[column.field])}
                        onChange={(date) => {
                          if (!date) {
                            // مقدار رو خالی کن
                            handleSetFilter(column.field, '')
                          } else {
                            handleSetFilter(column.field, convertToISOFormat(date)!.split('T')[0])
                          }

                          setTimeout(() => {
                            document.getElementById('runFilterPrivateButton')?.click()
                          }, 50)
                        }}
                      />
                      <Button
                        iconOnly
                        color="default"
                        size="sm"
                        onClick={() => {
                          handleSetFilter(column.field, '')
                          setTimeout(() => {
                            document.getElementById('runFilterPrivateButton')?.click()
                          }, 50)
                        }}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  )}
                  {column.type === 'dateFromTo' && column?.filterable && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1">
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
                            height: '32px',
                            borderRadius: '8px',
                            background: '#f4f4f5',
                            borderColor: '#e4e4e7',
                            borderWidth: '2px',
                            color: 'black',
                            padding: '0 12px',
                          }}
                          value={new Date(filters[column.field]?.from)}
                          onChange={(date) => {
                            if (!date) {
                              // مقدار رو خالی کن
                              handleSetFilter(column.field, '', 'from')
                            } else {
                              handleSetFilter(column.field, convertToISOFormat(date)!.split('T')[0], 'from')
                            }

                            setTimeout(() => {
                              document.getElementById('runFilterPrivateButton')?.click()
                            }, 50)
                          }}
                        />
                        <Button
                          iconOnly
                          color="default"
                          size="sm"
                          onClick={() => {
                            handleSetFilter(column.field, '', 'from')
                            setTimeout(() => {
                              document.getElementById('runFilterPrivateButton')?.click()
                            }, 50)
                          }}
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-1">
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
                            height: '32px',
                            borderRadius: '8px',
                            background: '#f4f4f5',
                            borderColor: '#e4e4e7',
                            borderWidth: '2px',
                            color: 'black',
                            padding: '0 12px',
                          }}
                          value={new Date(filters[column.field]?.to)}
                          onChange={(date) => {
                            if (!date) {
                              // مقدار رو خالی کن
                              handleSetFilter(column.field, '', 'to')
                            } else {
                              handleSetFilter(column.field, convertToISOFormat(date)!.split('T')[0], 'to')
                            }

                            setTimeout(() => {
                              document.getElementById('runFilterPrivateButton')?.click()
                            }, 50)
                          }}
                        />
                        <Button
                          iconOnly
                          color="default"
                          size="sm"
                          onClick={() => {
                            handleSetFilter(column.field, '', 'to')
                            setTimeout(() => {
                              document.getElementById('runFilterPrivateButton')?.click()
                            }, 50)
                          }}
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
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
          isLoading={isLoading}
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
                onClick={() => showAlert('برای حذف همه فیلتر ها مطمعن هستید؟', handleClearFilter)}
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
)

PaginatedList.displayName = 'PaginatedList'

export default PaginatedList

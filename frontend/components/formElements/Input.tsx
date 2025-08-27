'use client'
import { Checkbox } from '@heroui/checkbox'
import { Input as NextUiInput, Textarea } from '@heroui/input'
import { Radio, RadioGroup } from '@heroui/radio'
import { Select, SelectItem } from '@heroui/select'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import TimePicker from 'react-multi-date-picker/plugins/time_picker'
import 'react-multi-date-picker/styles/layouts/mobile.css'
import DatePicker from 'react-multi-date-picker'
import qs from 'qs'
import { InputOtp } from '@heroui/input-otp'
import { DatePicker as NextUiDatePicker } from '@heroui/date-picker'
import { I18nProvider } from '@react-aria/i18n'
import { parseAbsoluteToLocal } from '@internationalized/date'
import { Switch } from '@heroui/switch'

import EyeIcon from '../icons/EyeIcon'
import EyeCrossedIcon from '../icons/EyeCrossedIcon'

import Button from './Button'

import axiosInstance from '@/config/axios'
import { convertMinutesToTime, convertPersianToEnglish, convertTimeToMinutes, convertToISOFormat, debounce } from '@/helpers'
import useWindowSize from '@/hooks/useWindowSize'

interface CustomInputProps {
  generalType:
    | 'input'
    | 'checkbox'
    | 'radio'
    | 'textarea'
    | 'datePicker'
    | 'select'
    | 'combobox'
    | 'otp'
    | 'datePickerPro'
    | 'timePicker'
    | 'switch'
  name: string
  label?: string
  inputType?: 'text' | 'email' | 'number' | 'password' | 'tel'
  placeholder?: string
  description?: string | React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  isOutsideFilter?: boolean
  autoFocus?: boolean
  disabled?: boolean
  required?: boolean
  multiple?: boolean
  onlyYearPicker?: boolean
  minValue?: number
  maxValue?: number
  maxDate?: string
  minDate?: string
  iconStart?: React.ReactNode
  iconEnd?: React.ReactNode
  selectKey?: string
  selectValue?: string
  filterName?: string
  filterValue?: string | number
  apiField?: string
  searchMode?: 'local' | 'api'
  pageSize?: number
  otpLength?: number
  url?: string
  selectOptions?: {
    [key: string]: any
  }[]
  radioOptions?: {
    [key: string]: any
  }[]
}

const Input = ({
  generalType,
  inputType,
  label,
  name,
  placeholder: outerPlaceholder,
  description,
  className,
  iconStart,
  iconEnd,
  selectKey = 'code',
  selectValue = 'name',
  filterName = 'title',
  filterValue = '',
  apiField = 'data',
  searchMode = 'api',
  pageSize = 20,
  otpLength = 6,
  url,
  size,
  autoFocus,
  disabled,
  required,
  multiple,
  onlyYearPicker,
  minValue,
  maxValue,
  maxDate,
  minDate = '1300/1/1',
  selectOptions,
  radioOptions,
  isOutsideFilter,
}: PropsWithChildren<CustomInputProps>) => {
  const { width } = useWindowSize()
  const { control, getValues } = useFormContext()

  const [placeholder] = useState(outerPlaceholder || label + ' را وارد کنید')

  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const [options, setOptions] = useState<any[]>([])
  const [searchOptions, setSearchOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isFirstFetch, setIsFirstFetch] = useState(true)
  const [paginateDetail, setPaginateDetail] = useState({
    page: 1,
    pageSize,
    hasMore: true,
  })

  const handleGetData = async (searchValue?: string) => {
    if (url) {
      const params = isOutsideFilter
        ? {
            ...(filterValue ? { [filterName]: filterValue } : {}),
            ...(searchValue ? { [selectValue]: searchValue } : {}),
          }
        : {
            filters: {
              ...(filterValue ? { [filterName]: filterValue } : {}),
              ...(searchValue ? { [selectValue]: searchValue } : {}),
            },
            page: paginateDetail.page,
            pageSize: paginateDetail.pageSize,
          }

      const response = await axiosInstance.get(url, {
        params,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
      })

      setOptions(response?.data?.[apiField])
      setSearchOptions(response?.data?.[apiField])
    }
  }

  const fetchData = async (searchValue?: string) => {
    try {
      setLoading(true)
      if (isFirstFetch) {
        await handleGetData(searchValue)
        setIsFirstFetch(false)
      } else {
        if (searchMode === 'api') {
          await handleGetData(searchValue)
        } else {
          if (searchValue) {
            setSearchOptions(options.filter((item) => item[selectValue].includes(searchValue)))
          } else {
            setSearchOptions(options)
          }
        }
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = debounce((value: string) => {
    fetchData(value)
  }, 500)

  const handleComboboxChange = (value: string) => {
    debouncedSearch(value)
  }

  useEffect(() => {
    if (generalType === 'combobox') {
      fetchData()
    }
  }, [])

  switch (generalType) {
    case 'input':
      return (
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <NextUiInput
              {...field}
              autoFocus={autoFocus}
              className={className}
              classNames={{
                label: 'font-semibold text-sm',
              }}
              description={description}
              endContent={
                inputType === 'password' ? (
                  <Button
                    iconOnly
                    aria-label="toggle password visibility"
                    className="focus:outline-hidden rounded-full"
                    color="default"
                    variant="light"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? (
                      <EyeCrossedIcon className="text-text-light-25 size-4" />
                    ) : (
                      <EyeIcon className="text-text-light-25 size-4" />
                    )}
                  </Button>
                ) : (
                  iconEnd
                )
              }
              errorMessage={error?.message}
              isDisabled={disabled}
              isInvalid={!!error}
              isRequired={required}
              label={label}
              labelPlacement="outside"
              max={maxValue}
              min={minValue}
              placeholder={placeholder}
              radius="sm"
              size={size}
              startContent={iconStart}
              type={isPasswordVisible ? 'text' : inputType}
              validationBehavior="aria"
              onChange={(e) => {
                const value =
                  inputType === 'tel'
                    ? convertPersianToEnglish(e.target.value)
                    : inputType === 'number'
                      ? Number(e.target.value)
                      : e.target.value

                field.onChange(value)
              }}
            />
          )}
        />
      )

    case 'otp':
      return (
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <div className="flex flex-col relative">
              <label
                className="font-semibold pb-[6px] text-sm text-text-dark"
                htmlFor=""
              >
                {label}
                {required && <span className="text-error">*</span>}
              </label>
              <InputOtp
                {...field}
                fullWidth
                autoFocus={autoFocus}
                className={className}
                classNames={{ segmentWrapper: 'flex-row-reverse' }}
                description={description}
                errorMessage={error?.message}
                isDisabled={disabled}
                isInvalid={!!error}
                isRequired={required}
                label={label}
                length={otpLength}
                placeholder={placeholder}
                radius="md"
                size={size}
                validationBehavior="aria"
                onValueChange={(value: string) => {
                  field.onChange(value)
                  // Auto-submit when OTP is complete
                  if (value.length === otpLength) {
                    // Trigger form submission after a small delay to ensure the value is set
                    setTimeout(() => {
                      const form = field.name ? document.querySelector(`[name="${field.name}"]`)?.closest('form') : null
                      if (form) {
                        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
                      }
                    }, 100)
                  }
                }}
              />
            </div>
          )}
        />
      )

    case 'combobox':
      return (
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              autoFocus={autoFocus}
              className={className}
              classNames={{
                base: 'font-semibold [&_label]:text-sm',
              }}
              defaultItems={searchOptions}
              description={description}
              endContent={iconEnd}
              errorMessage={error?.message}
              isDisabled={disabled}
              isInvalid={!!error}
              isLoading={loading}
              isRequired={required}
              label={label}
              labelPlacement="outside"
              listboxProps={{
                emptyContent: 'موردی یافت نشد',
              }}
              placeholder={placeholder}
              radius="sm"
              selectedKey={field.value}
              size={size}
              startContent={iconStart}
              type={inputType}
              validationBehavior="aria"
              onInputChange={handleComboboxChange}
              onSelectionChange={(value) => {
                multiple ? field.onChange([...getValues(field.name), value]) : field.onChange(value)
              }}
              // onSelectionChange={(value) => field.onChange(value)}
            >
              {searchOptions?.map((option) => (
                <AutocompleteItem
                  key={option[selectKey]}
                  textValue={option[selectValue]}
                >
                  {option[selectValue]}
                </AutocompleteItem>
              ))}
              {/* <CustomInfiniteScroll
               fetchMoreData={fetchData}
               hasMore={paginateDetail.hasMore}
               /> */}
            </Autocomplete>
          )}
        />
      )

    case 'textarea':
      return (
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <Textarea
              {...field}
              isClearable
              autoFocus={autoFocus}
              className={className}
              classNames={{
                label: 'font-semibold text-sm',
              }}
              description={description}
              errorMessage={error?.message}
              isDisabled={disabled}
              isInvalid={!!error}
              isRequired={required}
              label={label}
              labelPlacement="outside"
              placeholder={placeholder}
              radius="sm"
              size={size}
              validationBehavior="aria"
              onClear={() => field.onChange('')}
            />
          )}
        />
      )

    case 'select':
      return (
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <Select
              {...field}
              autoFocus={autoFocus}
              className={className}
              classNames={{
                label: 'font-semibold text-sm',
              }}
              description={description}
              errorMessage={error?.message}
              isDisabled={disabled}
              isInvalid={!!error}
              isRequired={required}
              label={label}
              labelPlacement="outside"
              placeholder={placeholder}
              radius="sm"
              selectedKeys={multiple ? field.value : [field.value]}
              selectionMode={multiple ? 'multiple' : 'single'}
              size={size}
              validationBehavior="aria"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                multiple ? field.onChange(new Set(e.target.value.split(','))) : field.onChange(e)
              }}
            >
              {selectOptions!.map((item) => (
                <SelectItem
                  key={item[selectKey]}
                  textValue={item[selectValue]}
                >
                  {item[selectValue]}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      )

    case 'radio':
      return (
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <RadioGroup
              {...field}
              className={className}
              classNames={{
                label: `font-semibold text-dark text-sm ${error ? 'text-error' : ''}`,
              }}
              description={description}
              errorMessage={error?.message}
              isDisabled={disabled}
              isInvalid={!!error}
              isRequired={required}
              label={label}
              orientation="horizontal"
              size={size}
              validationBehavior="aria"
              value={field.value}
              onValueChange={field.onChange}
            >
              {radioOptions!.map((item) => (
                <Radio
                  key={item.code}
                  value={item.name}
                >
                  {item.name}
                </Radio>
              ))}
            </RadioGroup>
          )}
        />
      )

    case 'checkbox':
      return (
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <Checkbox
              {...field}
              className={className}
              classNames={{
                label: 'font-semibold text-sm',
              }}
              isDisabled={disabled}
              isInvalid={!!error}
              isSelected={field.value}
              size={size}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              {label}
            </Checkbox>
          )}
        />
      )

    case 'switch':
      return (
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <Switch
              {...field}
              className={className}
              classNames={{
                label: 'font-semibold text-sm',
              }}
              isDisabled={disabled}
              isSelected={field.value}
              size={size}
            >
              {label}
            </Switch>
          )}
        />
      )

    case 'datePickerPro':
      return (
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <I18nProvider locale="fa-IR-u-ca-persian">
              <NextUiDatePicker
                {...field}
                hideTimeZone
                showMonthAndYearPickers
                autoFocus={autoFocus}
                className={className}
                classNames={{
                  label: 'font-semibold text-sm',
                }}
                description={description}
                errorMessage={error?.message}
                granularity="day"
                isDisabled={disabled}
                isInvalid={!!error}
                isRequired={required}
                label={label}
                labelPlacement="outside"
                radius="sm"
                size={size}
                validationBehavior="aria"
                value={field.value ? parseAbsoluteToLocal(field.value) : null}
                variant="flat"
                onChange={(value: any) =>
                  field.onChange(
                    value &&
                      `${String(value?.year).padStart(4, '0')}-${String(value?.month).padStart(2, '0')}-${String(value?.day).padStart(2, '0')}T00:00:00Z`
                  )
                }
              />
            </I18nProvider>
          )}
        />
      )

    case 'datePicker':
      return (
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <div className="flex flex-col relative">
              <label
                className="font-semibold pb-[6px] text-sm text-text-dark"
                htmlFor=""
              >
                {label}
                {required && <span className="text-error">*</span>}
              </label>
              <DatePicker
                portal
                showOtherDays
                calendar={persian}
                calendarPosition="bottom-right"
                className={width < 768 ? 'rmdp-mobile' : ''}
                containerStyle={{
                  width: '100%',
                }}
                disabled={disabled}
                format={onlyYearPicker ? 'YYYY' : 'YYYY/MM/DD'} // تغییر فرمت در حالت فقط سال
                locale={persian_fa}
                mapDays={({ date }) => {
                  let props: { className?: string } = {}
                  let isWeekend = date.weekDay.index === 6

                  if (isWeekend) props.className = 'highlight highlight-red'

                  return props
                }}
                maxDate={maxDate} //new DateObject({ calendar: persian })
                minDate={minDate}
                onlyYearPicker={onlyYearPicker}
                placeholder={placeholder}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  height: '48px',
                  borderRadius: '8px',
                  background: '#f4f4f5',
                  borderColor: '#f4f4f5',
                  color: 'black',
                  padding: '0 12px',
                }}
                value={new Date(field.value)}
                onChange={(date) => field.onChange(date && convertToISOFormat(date))}
              />
              {error && <span className="text-red-500">{error?.message}</span>}
              {description && <p>{description}</p>}
            </div>
          )}
        />
      )

    case 'timePicker':
      return (
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <div className="flex flex-col relative">
              <label
                className="font-semibold pb-[6px] text-sm text-text-dark"
                htmlFor=""
              >
                {label}
                {required && <span className="text-error">*</span>}
              </label>
              <DatePicker
                disableDayPicker
                portal
                calendar={persian}
                calendarPosition="bottom-right"
                className={width < 768 ? 'rmdp-mobile' : ''}
                containerStyle={{
                  width: '100%',
                }}
                disabled={disabled}
                format="HH:mm"
                locale={persian_fa}
                placeholder={placeholder}
                plugins={[
                  <TimePicker
                    key="timePicker"
                    hideSeconds
                  />,
                ]}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  height: '48px',
                  borderRadius: '8px',
                  background: '#f4f4f5',
                  borderColor: '#f4f4f5',
                  color: 'black',
                  padding: '0 12px',
                }}
                value={new Date().setHours(
                  Number(convertMinutesToTime(field.value).hours),
                  Number(convertMinutesToTime(field.value).minutes),
                  0,
                  0
                )}
                onChange={(time) => field.onChange(convertTimeToMinutes(`${time?.hour}:${time?.minute}`))}
              />
              {error && <span className="text-danger text-tiny">{error?.message}</span>}
              {description && <p>{description}</p>}
            </div>
          )}
        />
      )

    default:
      return null
  }
}

export default Input

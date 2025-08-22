'use client'
// import Button from '@/components/formElements/Button'
import { Chip } from '@heroui/chip'
import React, { useEffect, useState } from 'react'
import { RadioGroup } from '@heroui/radio'
import { Calendar } from '@heroui/calendar'
import { DatePicker } from '@heroui/date-picker'
import { I18nProvider } from '@react-aria/i18n'
import { DateValue, parseAbsoluteToLocal } from '@internationalized/date'

import PaginatedList from '@/components/utils/PaginatedList' // import EditIcon from '@/components/icons/EditIcon'
// import EyeIcon from '@/components/icons/EyeIcon'
// import TrashIcon from '@/components/icons/TrashIcon'
// import UserSimulatorCard from '@/components/ui/card/UserSimulatorCard'
import DynamicTableActionButton from '@/components/utils/DynamicTableActionButton'
import { convertToDateString, handleDownloadPdf } from '@/helpers'
import useGlobal from '@/hooks/useGlobal' // import { Tab, Tabs } from '@heroui/tabs'
// import { Tooltip } from '@heroui/tooltip'
import Radio from '@/components/formElements/Radio'
import Participation from '@/components/certificate/participation'
import Button from '@/components/formElements/Button'
import useAuth from '@/hooks/useAuth'
import Completion from '@/components/certificate/completion'
import { PaginationListColumnType } from '@/types'

// const users = [
//   {
//     id: 1,
//     name: 'تونی رایخرت',
//     role: 'مدیر عامل',
//     team: 'مدیریت',
//     status: 'active',
//     age: '29',
//     avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
//     email: 'tony.reichert@example.com',
//   },
//   {
//     id: 2,
//     name: 'زویی لنگ',
//     role: 'رهبر فنی',
//     team: 'توسعه',
//     status: 'paused',
//     age: '25',
//     avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
//     email: 'zoey.lang@example.com',
//   },
//   {
//     id: 3,
//     name: 'جین فیشر',
//     role: 'توسعه‌دهنده ارشد',
//     team: 'توسعه',
//     status: 'active',
//     age: '22',
//     avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
//     email: 'jane.fisher@example.com',
//   },
//   {
//     id: 4,
//     name: 'ویلیام هوارد',
//     role: 'مدیر بازاریابی',
//     team: 'بازاریابی',
//     status: 'vacation',
//     age: '28',
//     avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d',
//     email: 'william.howard@example.com',
//   },
//   {
//     id: 5,
//     name: 'کریستن کوپر',
//     role: 'مدیر فروش',
//     team: 'فروش',
//     status: 'active',
//     age: '24',
//     avatar: 'https://i.pravatar.cc/150?u=a092581d4ef9026700d',
//     email: 'kristen.cooper@example.com',
//   },
//   {
//     id: 6,
//     name: 'برایان کیم',
//     role: 'مدیر پروژه',
//     team: 'مدیریت',
//     age: '29',
//     avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
//     email: 'brian.kim@example.com',
//     status: 'active',
//   },
//   {
//     id: 7,
//     name: 'مایکل هانت',
//     role: 'طراح',
//     team: 'طراحی',
//     status: 'paused',
//     age: '27',
//     avatar: 'https://i.pravatar.cc/150?u=a042581f4e29027007d',
//     email: 'michael.hunt@example.com',
//   },
//   {
//     id: 8,
//     name: 'سامانتا بروکس',
//     role: 'مدیر منابع انسانی',
//     team: 'منابع انسانی',
//     status: 'active',
//     age: '31',
//     avatar: 'https://i.pravatar.cc/150?u=a042581f4e27027008d',
//     email: 'samantha.brooks@example.com',
//   },
//   {
//     id: 9,
//     name: 'فرانک هریسون',
//     role: 'مدیر مالی',
//     team: 'مالی',
//     status: 'vacation',
//     age: '33',
//     avatar: 'https://i.pravatar.cc/150?img=4',
//     email: 'frank.harrison@example.com',
//   },
//   {
//     id: 10,
//     name: 'اما آدامز',
//     role: 'مدیر عملیات',
//     team: 'عملیات',
//     status: 'active',
//     age: '35',
//     avatar: 'https://i.pravatar.cc/150?img=5',
//     email: 'emma.adams@example.com',
//   },
//   {
//     id: 11,
//     name: 'براندون استیونس',
//     role: 'توسعه‌دهنده جوان',
//     team: 'توسعه',
//     status: 'active',
//     age: '22',
//     avatar: 'https://i.pravatar.cc/150?img=8',
//     email: 'brandon.stevens@example.com',
//   },
//   {
//     id: 12,
//     name: 'مگان ریچاردز',
//     role: 'مدیر محصول',
//     team: 'محصول',
//     status: 'paused',
//     age: '28',
//     avatar: 'https://i.pravatar.cc/150?img=10',
//     email: 'megan.richards@example.com',
//   },
//   {
//     id: 13,
//     name: 'الیور اسکات',
//     role: 'مدیر امنیت',
//     team: 'امنیت',
//     status: 'active',
//     age: '37',
//     avatar: 'https://i.pravatar.cc/150?img=12',
//     email: 'oliver.scott@example.com',
//   },
//   {
//     id: 14,
//     name: 'گریس آلن',
//     role: 'متخصص بازاریابی',
//     team: 'بازاریابی',
//     status: 'active',
//     age: '30',
//     avatar: 'https://i.pravatar.cc/150?img=16',
//     email: 'grace.allen@example.com',
//   },
//   {
//     id: 15,
//     name: 'نوآ کارتر',
//     role: 'متخصص فناوری اطلاعات',
//     team: 'فناوری اطلاعات',
//     status: 'paused',
//     age: '31',
//     avatar: 'https://i.pravatar.cc/150?img=15',
//     email: 'noah.carter@example.com',
//   },
//   {
//     id: 16,
//     name: 'آوا پرز',
//     role: 'مدیر',
//     team: 'فروش',
//     status: 'active',
//     age: '29',
//     avatar: 'https://i.pravatar.cc/150?img=20',
//     email: 'ava.perez@example.com',
//   },
//   {
//     id: 17,
//     name: 'لیام جانسون',
//     role: 'تحلیلگر داده',
//     team: 'تحلیل',
//     status: 'active',
//     age: '28',
//     avatar: 'https://i.pravatar.cc/150?img=33',
//     email: 'liam.johnson@example.com',
//   },
//   {
//     id: 18,
//     name: 'سوفیا تیلور',
//     role: 'تحلیلگر تضمین کیفیت',
//     team: 'تست',
//     status: 'active',
//     age: '27',
//     avatar: 'https://i.pravatar.cc/150?img=29',
//     email: 'sophia.taylor@example.com',
//   },
//   {
//     id: 19,
//     name: 'لوکاس هریس',
//     role: 'مدیر سیستم',
//     team: 'فناوری اطلاعات',
//     status: 'paused',
//     age: '32',
//     avatar: 'https://i.pravatar.cc/150?img=50',
//     email: 'lucas.harris@example.com',
//   },
//   {
//     id: 20,
//     name: 'میا رابینسون',
//     role: 'هماهنگ‌کننده',
//     team: 'عملیات',
//     status: 'active',
//     age: '26',
//     avatar: 'https://i.pravatar.cc/150?img=45',
//     email: 'mia.robinson@example.com',
//   },
// ]

// 671e14b682da061541745d3e
const Evaluators = () => {
  const { user } = useAuth()
  const { setData, activeRoute, data: globalData } = useGlobal()
  const [selected, setSelected] = useState('true')
  let [date, setDate] = React.useState<DateValue | null | any>(parseAbsoluteToLocal('2001-02-02T20:30:00Z'))

  const columns: PaginationListColumnType[] = [
    {
      label: 'شناسه',
      field: 'id',
      sortable: true,
      filterable: true,
      type: 'number',
    },
    {
      label: 'نام سازمان',
      field: 'organizationName',
      sortable: true,
      filterable: true,
      type: 'text',
    },
    {
      label: 'عنوان شبیه ساز',
      field: 'title',
      sortable: true,
      filterable: true,
      type: 'text',
    },
    {
      label: 'تعداد تسک',
      field: 'taskCount',
      sortable: true,
      filterable: true,
      type: 'inputFromTo',
    },
    {
      label: 'زمان شبیه ساز(به ساعت)',
      field: 'totalTasksEstimatedHours',
      sortable: true,
      filterable: true,
      type: 'inputFromTo',
    },
    {
      label: 'درجه سختی',
      field: 'difficultyLevel',
      sortable: true,
      filterable: true,
      type: 'select',
      filterItems: globalData.difficultyLevels,
    },
    // { label: 'تاریخ ایجاد', field: 'createdAt', sortable: true, filterable: true, type: 'date' },
    {
      label: 'تاریخ ایجاد',
      field: 'createdAt',
      sortable: true,
      filterable: true,
      type: 'dateFromTo',
    },
    {
      label: 'کنش ها',
      field: 'actions',
    },
  ]

  useEffect(() => {
    setData('navbar', { title: activeRoute.title })
  }, [])

  // const printRef = useRef<HTMLDivElement>(null)

  return (
    <section className="w-full">
      <I18nProvider locale="fa-IR-u-ca-persian">
        <Calendar
          showMonthAndYearPickers
          aria-label="تاریخ (تقویم ایرانی)"
        />
      </I18nProvider>
      <div className="p-4 bg-white">
        {JSON.stringify(date)}
        <br />
        {JSON.stringify(`${date?.year}-${date?.month}-${date?.day}T${date?.hour}:${date?.minute}:${date?.second}Z`)}
        <I18nProvider locale="fa-IR-u-ca-persian">
          <DatePicker
            hideTimeZone
            showMonthAndYearPickers
            className="max-w-md"
            granularity="day"
            value={date}
            variant="flat"
            onChange={setDate}
          />
        </I18nProvider>
      </div>
      <Completion
        jobSimulationName="شبیه‌سازی شغل برنامه‌نویسی"
        organizationLogoUrl="https://file-dev.ramooz.org/6766542d8e7412558b716466/image"
        organizationName="شرکت مثال"
        skills={[
          {
            skillId: '6746c049cfc3b2462266f48c',
            skillTitle: 'تشخیص بوی عطر های مختلف',
            percent: 25,
            weight: 1,
            colorCode: '#38A4A1',
          },
          {
            skillId: '6738849da029410b0a5fb482',
            skillTitle: 'شنوایی قوی',
            percent: 50,
            weight: 2,
            colorCode: '#691DF1',
          },
          {
            skillId: '67270fc7461fe8f5be4c9c56',
            skillTitle: 'دیدن اجسام کوچک',
            percent: 25,
            weight: 1,
            colorCode: '#E64DA3',
          },
        ]}
        user={user}
      />
      <Participation
        jobSimulationName="شبیه‌سازی شغل برنامه‌نویسی"
        organizationName="شرکت مثال"
        skills={[
          {
            skillId: '6746c049cfc3b2462266f48c',
            skillTitle: 'تشخیص بوی عطر های مختلف',
            percent: 25,
            weight: 1,
            colorCode: '#38A4A1',
          },
          {
            skillId: '6738849da029410b0a5fb482',
            skillTitle: 'شنوایی قوی',
            percent: 50,
            weight: 2,
            colorCode: '#691DF1',
          },
          {
            skillId: '67270fc7461fe8f5be4c9c56',
            skillTitle: 'دیدن اجسام کوچک',
            percent: 25,
            weight: 1,
            colorCode: '#E64DA3',
          },
        ]}
        user={user}
      />
      <Button
        onClick={() =>
          handleDownloadPdf(
            <Participation
              jobSimulationName="شبیه‌سازی شغل برنامه‌نویسی"
              organizationName="شرکت مثال"
              skills={[
                {
                  skillId: '6746c049cfc3b2462266f48c',
                  skillTitle: 'تشخیص بوی عطر های مختلف',
                  percent: 25,
                  weight: 1,
                  colorCode: '#38A4A1',
                },
                {
                  skillId: '6738849da029410b0a5fb482',
                  skillTitle: 'شنوایی قوی',
                  percent: 50,
                  weight: 2,
                  colorCode: '#691DF1',
                },
                {
                  skillId: '67270fc7461fe8f5be4c9c56',
                  skillTitle: 'دیدن اجسام کوچک',
                  percent: 25,
                  weight: 1,
                  colorCode: '#E64DA3',
                },
              ]}
              user={user}
            />,
            'Participation'
          )
        }
      >
        دانلود PDF
      </Button>
      <Button
        onClick={() =>
          handleDownloadPdf(
            <Completion
              jobSimulationName="شبیه‌سازی شغل برنامه‌نویسی"
              organizationLogoUrl="https://file-dev.ramooz.org/6766542d8e7412558b716466/image"
              organizationName="شرکت مثال"
              skills={[
                {
                  skillId: '6746c049cfc3b2462266f48c',
                  skillTitle: 'تشخیص بوی عطر های مختلف',
                  percent: 25,
                  weight: 1,
                  colorCode: '#38A4A1',
                },
                {
                  skillId: '6738849da029410b0a5fb482',
                  skillTitle: 'شنوایی قوی',
                  percent: 50,
                  weight: 2,
                  colorCode: '#691DF1',
                },
                {
                  skillId: '67270fc7461fe8f5be4c9c56',
                  skillTitle: 'دیدن اجسام کوچک',
                  percent: 25,
                  weight: 1,
                  colorCode: '#E64DA3',
                },
              ]}
              user={user}
            />,
            'Completion',
            'portrait'
          )
        }
      >
        دانلود PDF
      </Button>
      <RadioGroup
        className="my-4 bg-white p-4 w-full"
        value={selected}
        onValueChange={setSelected}
      >
        <Radio
          className={'!py-4 !px-5'}
          value={'true'}
        >
          <div className="flex items-center gap-4">
            <div className="max-w-20">
              <img
                alt="radio"
                src="/images/about-standard.webp"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-text-dark">عنوان</p>
              <p className="text-text-light-25 text-sm">توضیحات</p>
            </div>
          </div>
        </Radio>
        <Radio
          className={'!py-4 !px-5'}
          value={'false'}
        >
          <div className="flex items-center gap-4">
            <div className="max-w-20">
              <img
                alt="radio"
                src="/images/about-standard.webp"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-text-dark">عنوان</p>
              <p className="text-text-light-25 text-sm">توضیحات</p>
            </div>
          </div>
        </Radio>
      </RadioGroup>
      <RadioGroup
        className="my-4 bg-white p-4 w-full"
        value={selected}
        onValueChange={setSelected}
      >
        <Radio value={'true'}>بله</Radio>
        <Radio value="false">خیر</Radio>
      </RadioGroup>
      <div className="p-4 bg-white rounded-xl">
        <div className="w-full mx-auto">
          <PaginatedList
            columns={columns}
            searchField="title"
            url="job-simulations/visitor"
            urlParams={{
              filters: { organizationId: '671e14b682da061541745d3e' },
              page: 1,
              pageSize: 20,
            }}
          >
            {{
              difficultyLevel: (data: any, cellValue) => (
                <Chip
                  size="sm"
                  variant="flat"
                >
                  {cellValue}
                </Chip>
              ),
              actions: (data: any, cellValue) => (
                <div className="relative flex items-center justify-end gap-2">
                  <DynamicTableActionButton type="fileView" />
                  <DynamicTableActionButton type="edit" />
                  <DynamicTableActionButton type="delete" />
                </div>
              ),
              createdAt: (data: any, cellValue) => <p>{convertToDateString(cellValue)}</p>,
            }}
          </PaginatedList>
          {/* <CustomTable
           url="organizations/visitor"
           columns={columns}
           searchField="organizationName"
           // staticData={users}
           filterOptions={statusOptions}
           // initialVisibleColumns={[
           //   'id',
           //   'jobSimulationId',
           //   'jobSimulationTitle',
           //   'userId',
           //   'learnerFirstName',
           //   'learnerLastName',
           //   'organizationId',
           //   'organizationName',
           //   'status',
           //   'actions',
           // ]}
           >
           {{
           status: (data: any, cellValue) => (
           <Chip
           size="sm"
           variant="flat"
           >
           {cellValue}
           </Chip>
           ),
           actions: (data: any, cellValue) => (
           <div className="relative flex justify-end items-center gap-2">
           <Dropdown>
           <DropdownTrigger>
           <Button
           isIconOnly
           size="sm"
           variant="light"
           >
           <VerticalDotsIcon className="size-5" />
           </Button>
           </DropdownTrigger>
           <DropdownMenu variant="faded">
           <DropdownSection
           title="کنش های اصلی"
           showDivider
           >
           <DropdownItem
           key="view"
           startContent={<SearchAltIcon />}
           description="نمایش همه"
           >
           نمایش
           </DropdownItem>
           <DropdownItem
           key="edit"
           startContent={<SearchAltIcon />}
           description="ویرایش همه"
           >
           ویرایش
           </DropdownItem>
           </DropdownSection>
           <DropdownSection title="کنش های بیشتر">
           <DropdownItem
           key="delete"
           startContent={<SearchAltIcon className="text-error size-6" />}
           color="danger"
           className="text-error"
           description="حذف همه"
           >
           حذف
           </DropdownItem>
           </DropdownSection>
           </DropdownMenu>
           </Dropdown>
           </div>
           ),
           }}
           </CustomTable> */}
        </div>
      </div>

      {/* <div className="flex flex-col gap-2 md:gap-5 grow">
       <Tabs
       aria-label="Options"
       variant="light"
       key="light"
       classNames={{
       tab: 'border-2 border-primary data-[selected=true]:bg-primary data-[selected=true]:shadow-lg',
       tabContent: 'text-primary font-bold group-data-[selected=true]:text-white',
       }}
       >
       <Tab
       key="all"
       title="همه"
       >
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
       <UserSimulatorCard
       hasEvaluator
       to="/user/evaluators/507f191e810c19729de860ea"
       />
       <UserSimulatorCard
       hasEvaluator
       to="/user/evaluators/507f191e810c19729de860ea"
       />
       <UserSimulatorCard
       hasEvaluator
       to="/user/evaluators/507f191e810c19729de860ea"
       />
       <UserSimulatorCard
       hasEvaluator
       to="/user/evaluators/507f191e810c19729de860ea"
       />
       <UserSimulatorCard
       hasEvaluator
       to="/user/evaluators/507f191e810c19729de860ea"
       />
       <UserSimulatorCard
       hasEvaluator
       to="/user/evaluators/507f191e810c19729de860ea"
       />
       </div>
       </Tab>
       <Tab
       key="pending"
       title="درحال تکمیل"
       ></Tab>
       <Tab
       key="complete"
       title="تکمیل شده"
       ></Tab>
       </Tabs>
       </div> */}
    </section>
  )
}

export default Evaluators

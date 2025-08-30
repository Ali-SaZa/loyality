'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { useRouter, useParams } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import StoreIcon from '@/components/icons/ChartTreeIcon'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon'
import Input from '@/components/formElements/Input'
import { getStoreById, createStore, updateStore, Store, CreateStoreRequest, UpdateStoreRequest } from '@/services/stores'
import useLoading from '@/hooks/useLoading'
import { StorePlanType } from '@/types/enums'
import { StoreFormValidation, StoreUpdateValidation, StoreFormData, StoreUpdateData } from '@/validation/store'

const StoreForm = () => {
  const router = useRouter()
  const params = useParams()
  const storeId = params.id as string
  const isEditing = storeId && storeId !== 'new'
  const { setLoading } = useLoading()
  
  const [store, setStore] = useState<Store | null>(null)
  const [isLoading, setIsLoading] = useState(isEditing)

  const defaultValues = {
    name: '',
    ownerName: '',
    phoneNumber: '',
    userId: '',
    address: {
      city: '',
      street: '',
      coordinates: {
        lat: 0,
        lng: 0
      }
    },
    loyaltySettings: {
      tiers: [
        {
          minAmount: 0,
          rewardType: 'cashback',
          value: 5,
          description: 'پاداش پایه'
        }
      ],
      lotteryFrequency: 'none' as const,
      defaultCashbackRate: 5
    },
    plan: {
      type: 'free' as const,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  }

  const methods = useForm({
    resolver: zodResolver(isEditing ? StoreUpdateValidation : StoreFormValidation),
    defaultValues
  })

  const { handleSubmit, reset, formState: { errors } } = methods

  useEffect(() => {
    if (isEditing) {
      fetchStore()
    }
  }, [storeId])

  const fetchStore = async () => {
    try {
      setIsLoading(true)
      const storeData = await getStoreById(storeId)
      setStore(storeData)
      reset({
        name: storeData.name,
        ownerName: storeData.ownerName,
        phoneNumber: storeData.phoneNumber,
        userId: storeData.userId,
        address: storeData.address,
        loyaltySettings: storeData.loyaltySettings,
        plan: storeData.plan
      } as any)
    } catch (error) {
      console.error('Error fetching store:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: StoreFormData | StoreUpdateData) => {
    try {
      setLoading(true)
      
      if (isEditing) {
        // Update existing store
        const updateData: UpdateStoreRequest = {
          name: data.name,
          ownerName: data.ownerName,
          phoneNumber: data.phoneNumber,
          address: data.address,
          loyaltySettings: data.loyaltySettings,
          plan: data.plan
        }
        await updateStore(storeId, updateData)
      } else {
        // Create new store - data includes userId
        const createData = data as StoreFormData
        await createStore(createData)
      }
      
      router.push('/admin/stores')
    } catch (error) {
      console.error('Error saving store:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/stores')
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="text-center">
              <p className="text-text-light">در حال بارگذاری...</p>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          isIconOnly
          variant="light"
          onClick={handleCancel}
          aria-label="بازگشت"
        >
          <ArrowLeftIcon className="size-5" />
        </Button>
        <StoreIcon className="size-8 text-success" />
        <div>
          <h1 className="text-2xl font-bold text-text-dark">
            {isEditing ? 'ویرایش فروشگاه' : 'افزودن فروشگاه جدید'}
          </h1>
          <p className="text-text-light">
            {isEditing ? 'اطلاعات فروشگاه را ویرایش کنید' : 'اطلاعات فروشگاه جدید را وارد کنید'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="border-1">
        <CardHeader>
          <h3 className="text-lg font-semibold text-text-dark">اطلاعات فروشگاه</h3>
        </CardHeader>
        <CardBody>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  generalType="input"
                  name="name"
                  label="نام فروشگاه"
                  required
                />

                <Input
                  generalType="input"
                  name="ownerName"
                  label="نام صاحب فروشگاه"
                  required
                />

                <Input
                  generalType="input"
                  name="phoneNumber"
                  label="شماره تلفن"
                  inputType="tel"
                  required
                />

                                  <Input
                    generalType="input"
                    name="userId"
                    label="شناسه کاربر"
                    disabled={isEditing}
                    required={!isEditing}
                  />
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-text-dark">آدرس فروشگاه</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    generalType="input"
                    name="address.city"
                    label="شهر"
                    required
                  />

                  <Input
                    generalType="input"
                    name="address.street"
                    label="خیابان"
                  />
                </div>
              </div>

              {/* Plan Information */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-text-dark">نوع پلن</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    generalType="select"
                    name="plan.type"
                    label="نوع پلن"
                    selectOptions={[
                      { key: StorePlanType.FREE, value: 'رایگان' },
                      { key: StorePlanType.PREMIUM, value: 'پریمیوم' }
                    ]}
                  />

                  <Input
                    generalType="datePicker"
                    name="plan.startDate"
                    label="تاریخ شروع"
                  />

                  <Input
                    generalType="datePicker"
                    name="plan.endDate"
                    label="تاریخ پایان"
                  />
                </div>
              </div>

              {/* Loyalty Settings */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-text-dark">تنظیمات وفاداری</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    generalType="input"
                    name="loyaltySettings.defaultCashbackRate"
                    label="نرخ بازگشت پیش‌فرض (%)"
                    inputType="number"
                    minValue={0}
                    maxValue={100}
                  />

                  <Input
                    generalType="select"
                    name="loyaltySettings.lotteryFrequency"
                    label="فرکانس قرعه‌کشی"
                    selectOptions={[
                      { key: 'none', value: 'بدون قرعه‌کشی' },
                      { key: 'weekly', value: 'هفتگی' },
                      { key: 'monthly', value: 'ماهانه' }
                    ]}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-divider">
                <Button
                  variant="flat"
                  color="default"
                  onClick={handleCancel}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  color={isEditing ? "primary" : "success"}
                  startContent={<StoreIcon className="size-5" />}
                >
                  {isEditing ? 'بروزرسانی فروشگاه' : 'ایجاد فروشگاه'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardBody>
      </Card>
    </div>
  )
}

export default StoreForm

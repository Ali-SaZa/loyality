'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { useRouter, useParams } from 'next/navigation'

import StoreIcon from '@/components/icons/ChartTreeIcon'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon'
import EditIcon from '@/components/icons/EditIcon'
import { getStoreById, Store } from '@/services/stores'
import useLoading from '@/hooks/useLoading'
import { StorePlanType, getStorePlanConfig } from '@/types/enums'

const ViewStore = () => {
  const router = useRouter()
  const params = useParams()
  const storeId = params.id as string
  const { setLoading } = useLoading()
  
  const [store, setStore] = useState<Store | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStore()
  }, [storeId])

  const fetchStore = async () => {
    try {
      setIsLoading(true)
      const storeData = await getStoreById(storeId)
      setStore(storeData)
    } catch (error) {
      console.error('Error fetching store:', error)
      setError(error instanceof Error ? error.message : 'خطا در بارگذاری فروشگاه')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    router.push(`/admin/stores/${storeId}`)
  }

  const handleBack = () => {
    router.push('/admin/stores')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fa-IR')
  }

  const formatPhoneNumber = (phone: string) => {
    if (phone.startsWith('09')) {
      return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3')
    }
    return phone
  }

  const getAddressText = (address: Store['address']) => {
    const parts = []
    if (address.street) parts.push(address.street)
    if (address.city) parts.push(address.city)
    return parts.join('، ') || 'آدرس ثبت نشده'
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

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="text-center">
              <p className="text-danger mb-4">{error}</p>
              <Button color="primary" onClick={fetchStore}>
                تلاش مجدد
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="p-6">
        <Card className="border-1">
          <CardBody className="p-6">
            <div className="text-center">
              <p className="text-danger">فروشگاه یافت نشد</p>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  const planConfig = getStorePlanConfig(store.plan.type)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            variant="light"
            onClick={handleBack}
            aria-label="بازگشت"
          >
            <ArrowLeftIcon className="size-5" />
          </Button>
          <StoreIcon className="size-8 text-success" />
          <div>
            <h1 className="text-2xl font-bold text-text-dark">جزئیات فروشگاه</h1>
            <p className="text-text-light">مشاهده اطلاعات کامل فروشگاه</p>
          </div>
        </div>
        <Button
          color="primary"
          startContent={<EditIcon className="size-5" />}
          onClick={handleEdit}
        >
          ویرایش
        </Button>
      </div>

      {/* Store Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="border-1">
          <CardHeader>
            <h3 className="text-lg font-semibold text-text-dark">اطلاعات پایه</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-light mb-1">
                نام فروشگاه
              </label>
              <p className="text-text-dark font-medium">{store.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-1">
                نام صاحب فروشگاه
              </label>
              <p className="text-text-dark font-medium">{store.ownerName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-1">
                شماره تلفن
              </label>
              <p className="text-text-dark font-medium">{formatPhoneNumber(store.phoneNumber)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-1">
                شناسه کاربر
              </label>
              <p className="text-text-dark font-medium">{store.userId}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-1">
                تاریخ ایجاد
              </label>
              <p className="text-text-dark font-medium">{formatDate(store.createdAt)}</p>
            </div>
          </CardBody>
        </Card>

        {/* Address Information */}
        <Card className="border-1">
          <CardHeader>
            <h3 className="text-lg font-semibold text-text-dark">آدرس فروشگاه</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-light mb-1">
                شهر
              </label>
              <p className="text-text-dark font-medium">{store.address.city || 'ثبت نشده'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-1">
                خیابان
              </label>
              <p className="text-text-dark font-medium">{store.address.street || 'ثبت نشده'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-1">
                آدرس کامل
              </label>
              <p className="text-text-dark font-medium">{getAddressText(store.address)}</p>
            </div>
          </CardBody>
        </Card>

        {/* Plan Information */}
        <Card className="border-1">
          <CardHeader>
            <h3 className="text-lg font-semibold text-text-dark">اطلاعات پلن</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-light mb-1">
                نوع پلن
              </label>
              <Chip
                color={planConfig.color}
                variant="flat"
                size="sm"
              >
                {planConfig.text}
              </Chip>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-1">
                تاریخ شروع
              </label>
              <p className="text-text-dark font-medium">{formatDate(store.plan.startDate)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-1">
                تاریخ پایان
              </label>
              <p className="text-text-dark font-medium">{formatDate(store.plan.endDate)}</p>
            </div>
          </CardBody>
        </Card>

        {/* Loyalty Settings */}
        <Card className="border-1">
          <CardHeader>
            <h3 className="text-lg font-semibold text-text-dark">تنظیمات وفاداری</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-light mb-1">
                نرخ بازگشت پیش‌فرض
              </label>
              <p className="text-text-dark font-medium">{store.loyaltySettings.defaultCashbackRate}%</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-1">
                فرکانس قرعه‌کشی
              </label>
              <p className="text-text-dark font-medium">
                {store.loyaltySettings.lotteryFrequency === 'none' && 'بدون قرعه‌کشی'}
                {store.loyaltySettings.lotteryFrequency === 'weekly' && 'هفتگی'}
                {store.loyaltySettings.lotteryFrequency === 'monthly' && 'ماهانه'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-1">
                تعداد سطوح پاداش
              </label>
              <p className="text-text-dark font-medium">{store.loyaltySettings.tiers.length} سطح</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default ViewStore

'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'

import PromoCodeIcon from '@/components/icons/PromoCodeIcon'
import { getAllPromoCodes, getPromoCodeStats, PromoCode, PromoCodeStats } from '@/services/promo-codes'
import { getAllPromotions, Promotion } from '@/services/promotions'
import useLoading from '@/hooks/useLoading'
import { getPromoCodeStatusConfig } from '@/types/enums'
import { formatDateToPersianJalali } from '@/helpers'
import useAuth from '@/hooks/useAuth'

const StorePromoCodes = () => {
  const { setLoading } = useLoading()
  const { user } = useAuth()
  
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [stats, setStats] = useState<PromoCodeStats>({
    total: 0,
    unused: 0,
    used: 0,
    registered: 0,
    deleted: 0
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPromoCodes()
    fetchStats()
    fetchPromotions()
  }, [])

  const fetchPromoCodes = async () => {
    try {
      setLoading(true)
      setError(null)
      // For store users, the backend should filter promo codes by the authenticated store
      const response = await getAllPromoCodes({ page: 1, limit: 50 })
      setPromoCodes(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری کدهای تخفیف')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const statsData = await getPromoCodeStats()
      setStats(statsData)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const fetchPromotions = async () => {
    try {
      // For store users, the backend should filter promotions by the authenticated store
      const response = await getAllPromotions({ page: 1, limit: 100 })
      setPromotions(response.data)
    } catch (err) {
      console.error('Error fetching promotions:', err)
    }
  }

  const getStatusColor = (status: string) => {
    return getPromoCodeStatusConfig(status).color
  }

  const getStatusText = (status: string) => {
    return getPromoCodeStatusConfig(status).text
  }

  const getPromotionTitle = (promoCode: PromoCode) => {
    // Use populated promotion data if available, otherwise fallback to lookup
    if (promoCode.promotion) {
      return promoCode.promotion.title
    }
    const promotion = promotions.find(p => p.id === promoCode.promotionId)
    return promotion?.title || 'نامشخص'
  }

  const getUserInfo = (promoCode: PromoCode) => {
    if (promoCode.user) {
      const fullName = [promoCode.user.firstName, promoCode.user.lastName].filter(Boolean).join(' ')
      return {
        phoneNumber: promoCode.user.phoneNumber,
        fullName: fullName || 'نامشخص'
      }
    }
    return {
      phoneNumber: promoCode.userId ? 'نامشخص' : 'ثبت نشده',
      fullName: 'نامشخص'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <PromoCodeIcon className="size-8 text-success" />
        <div>
          <h1 className="text-2xl font-bold text-text-dark">مدیریت کدهای تخفیف</h1>
          <p className="text-text-light">مشاهده و مدیریت کدهای تخفیف فروشگاه</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-1">
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-sm text-text-light">کل کدها</p>
              <p className="text-2xl font-bold text-text-dark">{stats.total}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="border-1">
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-sm text-text-light">استفاده نشده</p>
              <p className="text-2xl font-bold text-success">{stats.unused}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="border-1">
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-sm text-text-light">استفاده شده</p>
              <p className="text-2xl font-bold text-warning">{stats.used}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="border-1">
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-sm text-text-light">ثبت شده</p>
              <p className="text-2xl font-bold text-primary">{stats.registered}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="border-1">
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-sm text-text-light">حذف شده</p>
              <p className="text-2xl font-bold text-danger">{stats.deleted}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-1 border-danger">
          <CardBody className="p-4">
            <p className="text-danger">{error}</p>
          </CardBody>
        </Card>
      )}

      {/* Promo Codes Table */}
      <Card className="border-1">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-text-dark">لیست کدهای تخفیف</h3>
        </CardHeader>
        <CardBody className="p-0">
          <Table aria-label="Promo codes table">
            <TableHeader>
              <TableColumn>کد</TableColumn>
              <TableColumn>تبلیغ مربوطه</TableColumn>
              <TableColumn>وضعیت</TableColumn>
              <TableColumn>کاربر</TableColumn>
              <TableColumn>تاریخ ثبت</TableColumn>
              <TableColumn>تاریخ استفاده</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={error ? "خطا در بارگذاری" : "هیچ کد تخفیفی یافت نشد"}
            >
              {promoCodes.map((promoCode) => {
                const userInfo = getUserInfo(promoCode)
                return (
                  <TableRow key={promoCode.id}>
                    <TableCell>
                      <div className="font-mono font-medium text-text-dark bg-background-100 px-2 py-1 rounded">
                        {promoCode.code}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-text-dark">
                        {getPromotionTitle(promoCode)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={getStatusColor(promoCode.status)}
                        variant="flat"
                      >
                        {getStatusText(promoCode.status)}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-text-light">
                        <div>{userInfo.fullName}</div>
                        <div className="text-xs">{userInfo.phoneNumber}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-text-light">
                        {promoCode.registeredAt ? formatDateToPersianJalali(promoCode.registeredAt) : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-text-light">
                        {promoCode.usedAt ? formatDateToPersianJalali(promoCode.usedAt) : '-'}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  )
}

export default StorePromoCodes

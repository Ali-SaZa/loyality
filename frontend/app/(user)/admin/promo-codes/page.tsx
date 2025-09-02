'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'

import PromoCodeIcon from '@/components/icons/PromoCodeIcon'
import EditIcon from '@/components/icons/EditIcon'
import EyeIcon from '@/components/icons/EyeIcon'
import { getAllPromoCodes, getPromoCodeStats, deletePromoCode, PromoCode, PromoCodeStats } from '@/services/promo-codes'
import { getAllPromotions, Promotion } from '@/services/promotions'
import useLoading from '@/hooks/useLoading'
import { getPromoCodeStatusConfig } from '@/types/enums'
import PromoCodeViewModal from '@/components/modals/PromoCodeViewModal'

const AdminPromoCodes = () => {
  const { setLoading } = useLoading()
  
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [stats, setStats] = useState<PromoCodeStats>({
    total: 0,
    unused: 0,
    used: 0,
    registered: 0
  })
  const [error, setError] = useState<string | null>(null)

  // Promo code form modal state
  const [promoCodeFormModal, setPromoCodeFormModal] = useState({
    isOpen: false,
    promoCodeId: undefined as string | undefined
  })

  // Promo code view modal state
  const [promoCodeViewModal, setPromoCodeViewModal] = useState({
    isOpen: false,
    promoCodeId: undefined as string | undefined
  })

  // Delete confirmation modal state
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    promoCodeId: undefined as string | undefined,
    promoCodeCode: ''
  })

  useEffect(() => {
    fetchPromoCodes()
    fetchStats()
    fetchPromotions()
  }, [])

  const fetchPromoCodes = async () => {
    try {
      setLoading(true)
      setError(null)
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

  const getPromotionTitle = (promotionId: string) => {
    const promotion = promotions.find(p => p.id === promotionId)
    return promotion?.title || 'نامشخص'
  }

  const handleAddPromoCode = () => {
    setPromoCodeFormModal({
      isOpen: true,
      promoCodeId: undefined
    })
  }

  const handleEditPromoCode = (promoCodeId: string) => {
    setPromoCodeFormModal({
      isOpen: true,
      promoCodeId
    })
  }

  const handleViewPromoCode = (promoCodeId: string) => {
    setPromoCodeViewModal({
      isOpen: true,
      promoCodeId
    })
  }

  const handleModalClose = () => {
    setPromoCodeFormModal({ isOpen: false, promoCodeId: undefined })
    setPromoCodeViewModal({ isOpen: false, promoCodeId: undefined })
    setDeleteConfirmModal({ isOpen: false, promoCodeId: undefined, promoCodeCode: '' })
  }

  const handleModalSuccess = () => {
    fetchPromoCodes()
    fetchStats()
    handleModalClose()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <PromoCodeIcon className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">کدهای تخفیف</h1>
            <p className="text-gray-600">مدیریت کدهای تخفیف و تبلیغات</p>
          </div>
        </div>
        <Button
          color="primary"
          onClick={handleAddPromoCode}
          className="font-medium"
        >
          افزودن کد تخفیف
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">کل کدها</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.unused}</div>
            <div className="text-sm text-gray-600">استفاده نشده</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.registered}</div>
            <div className="text-sm text-gray-600">ثبت شده</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.used}</div>
            <div className="text-sm text-gray-600">استفاده شده</div>
          </CardBody>
        </Card>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardBody>
            <p className="text-red-600">{error}</p>
          </CardBody>
        </Card>
      )}

      {/* Promo Codes Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">لیست کدهای تخفیف</h3>
        </CardHeader>
        <CardBody>
          <Table aria-label="Promo codes table">
            <TableHeader>
              <TableColumn>کد</TableColumn>
              <TableColumn>تبلیغ</TableColumn>
              <TableColumn>وضعیت</TableColumn>
              <TableColumn>کاربر</TableColumn>
              <TableColumn>تاریخ ثبت</TableColumn>
              <TableColumn>عملیات</TableColumn>
            </TableHeader>
            <TableBody>
              {promoCodes.map((promoCode) => (
                <TableRow key={promoCode.id}>
                  <TableCell>
                    <div className="font-mono font-bold text-lg text-primary">
                      {promoCode.code}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {getPromotionTitle(promoCode.promotionId)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(promoCode.status)}
                      variant="flat"
                      size="sm"
                    >
                      {getStatusText(promoCode.status)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {promoCode.userId ? 'ثبت شده' : 'ثبت نشده'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {promoCode.registeredAt 
                        ? new Date(promoCode.registeredAt).toLocaleDateString('fa-IR')
                        : '-'
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={() => handleViewPromoCode(promoCode.id)}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={() => handleEditPromoCode(promoCode.id)}
                      >
                        <EditIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Modals */}
      <PromoCodeViewModal
        isOpen={promoCodeViewModal.isOpen}
        promoCodeId={promoCodeViewModal.promoCodeId}
        onClose={handleModalClose}
        promotions={promotions}
      />
    </div>
  )
}

export default AdminPromoCodes

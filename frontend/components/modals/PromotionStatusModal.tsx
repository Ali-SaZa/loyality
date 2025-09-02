'use client'
import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Modal from './Modal'
import Input from '@/components/formElements/Input'
import useLoading from '@/hooks/useLoading'
import { ChangePromotionStatusValidation, ChangePromotionStatusData } from '@/validation/promotion'
import { changePromotionStatus, ChangePromotionStatusRequest } from '@/services/promotions'

interface PromotionStatusModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSuccess?: () => void
  promotionId?: string
  currentStatus?: string
  promotionTitle?: string
}

const PromotionStatusModal = ({ 
  isOpen, 
  onOpenChange, 
  onSuccess, 
  promotionId, 
  currentStatus = 'active',
  promotionTitle = ''
}: PromotionStatusModalProps) => {
  const { setLoading } = useLoading()
  const [error, setError] = useState<string | null>(null)

  const methods = useForm<ChangePromotionStatusData>({
    resolver: zodResolver(ChangePromotionStatusValidation),
    defaultValues: {
      status: currentStatus as 'active' | 'inactive' | 'deleted' | 'expired'
    }
  })

  useEffect(() => {
    if (isOpen && currentStatus) {
      methods.reset({
        status: currentStatus as 'active' | 'inactive' | 'deleted' | 'expired'
      })
      setError(null)
    }
  }, [isOpen, currentStatus])

  const onSubmit = async (data: ChangePromotionStatusData) => {
    if (!promotionId) return

    try {
      setLoading(true)
      setError(null)
      
      await changePromotionStatus(promotionId, data as ChangePromotionStatusRequest)
      
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در تغییر وضعیت تبلیغ')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setError(null)
  }

  const getStatusOptions = () => {
    const options = [
      { code: 'active', name: 'فعال' },
      { code: 'inactive', name: 'غیرفعال' },
      { code: 'expired', name: 'منقضی شده' },
      { code: 'deleted', name: 'حذف شده' }
    ]

    // Filter out current status to avoid selecting the same status
    return options.filter(option => option.code !== currentStatus)
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      onAccept={methods.handleSubmit(onSubmit)}
      onReject={handleClose}
      title="تغییر وضعیت تبلیغ"
      acceptBtnText="تغییر وضعیت"
      rejectBtnText="انصراف"
      acceptBtnColor="primary"
      size="md"
    >
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        <div className="text-center">
          <p className="text-text-dark mb-4">
            تغییر وضعیت تبلیغ: <strong>{promotionTitle}</strong>
          </p>
          <p className="text-text-light text-sm mb-6">
            وضعیت فعلی: <span className="font-medium">{getStatusOptions().find(opt => opt.code === currentStatus)?.name || currentStatus}</span>
          </p>
        </div>

        <FormProvider {...methods}>
          <Input
            generalType="select"
            name="status"
            label="وضعیت جدید"
            placeholder="وضعیت جدید را انتخاب کنید"
            selectOptions={getStatusOptions()}
            description="وضعیت جدید تبلیغ"
            required={true}
          />
        </FormProvider>

        <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
          <p className="text-warning text-sm">
            <strong>توجه:</strong> تغییر وضعیت تبلیغ به "حذف شده" باعث حذف نرم تمام کدهای تخفیف مرتبط خواهد شد.
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default PromotionStatusModal

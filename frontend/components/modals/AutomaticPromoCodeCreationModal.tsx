'use client'
import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Modal from './Modal'
import Input from '@/components/formElements/Input'
import useLoading from '@/hooks/useLoading'
import { AutomaticPromoCodeCreationValidation, AutomaticPromoCodeCreationData } from '@/validation/automaticPromoCodeCreation'
import { bulkCreatePromoCodes, BulkCreatePromoCodesRequest } from '@/services/promo-codes'

interface AutomaticPromoCodeCreationModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSuccess?: () => void
  promotionId: string
  storeName: string
}

const AutomaticPromoCodeCreationModal = ({ 
  isOpen, 
  onOpenChange, 
  onSuccess, 
  promotionId, 
  storeName 
}: AutomaticPromoCodeCreationModalProps) => {
  const { setLoading } = useLoading()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Extract prefix from store name (first part before space)
  const defaultPrefix = storeName.split(' ')[0].toUpperCase()

  const methods = useForm<AutomaticPromoCodeCreationData>({
    resolver: zodResolver(AutomaticPromoCodeCreationValidation),
    defaultValues: {
      prefix: defaultPrefix,
      count: 10
    }
  })

  // Reset form when storeName changes or modal opens
  useEffect(() => {
    if (isOpen) {
      methods.reset({
        prefix: defaultPrefix,
        count: 10
      })
    }
  }, [isOpen, storeName, methods, defaultPrefix])

  const onSubmit = async (data: AutomaticPromoCodeCreationData) => {
    try {
      console.log('Automatic promo code creation submitted with data:', data)
      setIsSubmitting(true)
      setError(null)
      
      const requestData: BulkCreatePromoCodesRequest = {
        promotionId,
        prefix: data.prefix,
        count: data.count
      }
      
      console.log('Request data:', requestData)
      
      await bulkCreatePromoCodes(requestData)
      
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      console.error('Error creating promo codes:', err)
      setError(err instanceof Error ? err.message : 'خطا در ایجاد کدهای تخفیف')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setError(null)
    methods.reset({
      prefix: defaultPrefix,
      count: 10
    })
  }

  const handleSubmit = methods.handleSubmit(onSubmit)

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      onClose={handleClose}
      onAccept={handleSubmit}
      onReject={handleClose}
      title="ایجاد خودکار کدهای تخفیف"
      acceptBtnText="ایجاد کدها"
      rejectBtnText="انصراف"
      acceptBtnColor="primary"
      size="lg"
      isLoading={isSubmitting}
      acceptBtnDisabled={isSubmitting}
    >
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="text-sm text-gray-600 mb-4">
          <p>کدهای تخفیف برای تبلیغ <strong>{promotionId}</strong> ایجاد خواهند شد.</p>
          <p>پیشوند پیش‌فرض از نام فروشگاه استخراج شده است.</p>
        </div>

        <FormProvider {...methods}>
          <div className="space-y-4">
            <Input
              generalType="input"
              name="prefix"
              label="پیشوند کدها"
              placeholder="مثال: WELCOME2024"
              description="پیشوند برای همه کدهای تخفیف استفاده می‌شود (فقط حروف انگلیسی و اعداد، بدون فاصله)"
            />
            
            <Input
              generalType="input"
              inputType="number"
              name="count"
              label="تعداد کدها"
              placeholder="10"
              description="تعداد کدهای تخفیف که ایجاد می‌شوند (حداکثر ۱۰۰۰)"
            />
          </div>
        </FormProvider>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">نمونه کدهای ایجاد شده:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• {methods.watch('prefix') || defaultPrefix}1A2B3</p>
            <p>• {methods.watch('prefix') || defaultPrefix}4C5D6</p>
            <p>• {methods.watch('prefix') || defaultPrefix}7E8F9</p>
            <p className="text-xs text-blue-600 mt-2">
              کدها به صورت خودکار منحصر به فرد خواهند بود.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AutomaticPromoCodeCreationModal

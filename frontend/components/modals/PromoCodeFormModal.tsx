'use client'
import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Modal from './Modal'
import Input from '@/components/formElements/Input'
import useLoading from '@/hooks/useLoading'
import { CreatePromoCodeValidation, UpdatePromoCodeValidation, CreatePromoCodeData, UpdatePromoCodeData } from '@/validation/promoCode'
import { PromoCode, getPromoCodeById, createPromoCode, updatePromoCode, CreatePromoCodeRequest, UpdatePromoCodeRequest } from '@/services/promo-codes'
import { Promotion } from '@/services/promotions'

interface PromoCodeFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  promoCodeId?: string // If provided, it's edit mode
  promotions: Promotion[]
}

const PromoCodeFormModal = ({ isOpen, onClose, onSuccess, promoCodeId, promotions }: PromoCodeFormModalProps) => {
  const { setLoading } = useLoading()
  const [promoCode, setPromoCode] = useState<PromoCode | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isEditMode = !!promoCodeId

  const methods = useForm<CreatePromoCodeData | UpdatePromoCodeData>({
    resolver: zodResolver(isEditMode ? UpdatePromoCodeValidation : CreatePromoCodeValidation),
    defaultValues: {
      code: '',
      promotionId: '',
      notes: ''
    }
  })

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && promoCodeId) {
        fetchPromoCode(promoCodeId)
      } else {
        // Reset form for create mode
        methods.reset({
          code: '',
          promotionId: '',
          notes: ''
        })
        setError(null)
      }
    }
  }, [isOpen, isEditMode, promoCodeId])

  const fetchPromoCode = async (promoCodeId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const promoCodeData = await getPromoCodeById(promoCodeId)
      setPromoCode(promoCodeData)
      
      methods.reset({
        code: promoCodeData.code,
        promotionId: promoCodeData.promotionId,
        notes: promoCodeData.notes || ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری اطلاعات کد تخفیف')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: CreatePromoCodeData | UpdatePromoCodeData) => {
    try {
      console.log('Form submitted with data:', data)
      setLoading(true)
      setError(null)
      
      // Transform the data for API
      const transformedData: any = {
        ...data
      }
      
      // Remove any undefined values to clean up the object
      Object.keys(transformedData).forEach(key => {
        if (transformedData[key] === undefined) {
          delete transformedData[key]
        }
      })
      
      console.log('Transformed data:', transformedData)
      
      if (isEditMode && promoCodeId) {
        await updatePromoCode(promoCodeId, transformedData as UpdatePromoCodeRequest)
      } else {
        await createPromoCode(transformedData as CreatePromoCodeRequest)
      }
      
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ذخیره کد تخفیف')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setError(null)
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      title={isEditMode ? 'ویرایش کد تخفیف' : 'افزودن کد تخفیف جدید'}
      size="2xl"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="code"
              generalType="input"
              label="کد تخفیف"
              placeholder="مثال: WELCOME50"
              description="کد 6-12 کاراکتری شامل حروف بزرگ و اعداد"
              disabled={isEditMode} // Code cannot be changed in edit mode
            />

            <Input
              name="promotionId"
              generalType="select"
              label="تبلیغ"
              selectOptions={promotions.map(promotion => ({
                code: promotion.id,
                name: promotion.status === 'deleted' ? `${promotion.title} (حذف شده)` : promotion.title,
                disabled: promotion.status === 'deleted' // Disable deleted promotions
              }))}
              placeholder="انتخاب تبلیغ"
              description="تبلیغی که این کد به آن تعلق دارد"
              disabled={isEditMode} // Promotion cannot be changed in edit mode
            />
          </div>

          <Input
            name="notes"
            generalType="textarea"
            label="یادداشت"
            placeholder="یادداشت اختیاری درباره این کد تخفیف"
            description="توضیحات اضافی (اختیاری)"
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {isEditMode ? 'ویرایش' : 'افزودن'}
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  )
}

export default PromoCodeFormModal

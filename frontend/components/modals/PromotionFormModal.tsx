'use client'
import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Modal from './Modal'
import Input from '@/components/formElements/Input'
import useLoading from '@/hooks/useLoading'
import { CreatePromotionValidation, UpdatePromotionValidation, CreatePromotionData, UpdatePromotionData } from '@/validation/promotion'
import { PromotionType, PromotionStatus } from '@/types/enums'
import { Promotion, getPromotionById, createPromotion, updatePromotion } from '@/services/promotions'

interface PromotionFormModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSuccess?: () => void
  promotionId?: string // If provided, it's edit mode
  storeId?: string // Required for create mode
}

const PromotionFormModal = ({ isOpen, onOpenChange, onSuccess, promotionId, storeId }: PromotionFormModalProps) => {
  const { setLoading } = useLoading()
  const [promotion, setPromotion] = useState<Promotion | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isEditMode = !!promotionId

  const methods = useForm<CreatePromotionData | UpdatePromotionData>({
    resolver: zodResolver(isEditMode ? UpdatePromotionValidation : CreatePromotionValidation),
    defaultValues: {
      storeId: storeId || '',
      type: 'coupon',
      title: '',
      description: '',
      value: 0,
      minPurchaseAmount: 0,
      maxDiscountAmount: 0,
      code: '',
      points: 0,
      startDate: '',
      endDate: '',
      usageLimit: 0,
      applicableEvents: [],
      maxUsagePerCustomer: 0,
      isStackable: false,
      stackableWith: [],
      termsAndConditions: '',
      requiresApproval: false
    }
  })

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && promotionId) {
        fetchPromotion(promotionId)
      } else {
        // Reset form for create mode
        methods.reset({
          storeId: storeId || '',
          type: 'coupon',
          title: '',
          description: '',
          value: 0,
          minPurchaseAmount: 0,
          maxDiscountAmount: 0,
          code: '',
          points: 0,
          startDate: '',
          endDate: '',
          usageLimit: 0,
          applicableEvents: [],
          maxUsagePerCustomer: 0,
          isStackable: false,
          stackableWith: [],
          termsAndConditions: '',
          requiresApproval: false
        })
        setError(null)
      }
    }
  }, [isOpen, isEditMode, promotionId, storeId])

  const fetchPromotion = async (promotionId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const promotionData = await getPromotionById(promotionId)
      setPromotion(promotionData)
      
      methods.reset({
        title: promotionData.title,
        description: promotionData.description || '',
        value: promotionData.value || 0,
        minPurchaseAmount: promotionData.minPurchaseAmount || 0,
        maxDiscountAmount: promotionData.maxDiscountAmount || 0,
        usageLimit: promotionData.usageLimit || 0,
        maxUsagePerCustomer: promotionData.maxUsagePerCustomer || 0,
        isStackable: promotionData.isStackable || false,
        stackableWith: promotionData.stackableWith || [],
        termsAndConditions: promotionData.termsAndConditions || '',
        requiresApproval: promotionData.requiresApproval || false,
        applicableEvents: promotionData.applicableEvents || []
      } as any)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری اطلاعات تبلیغ')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: CreatePromotionData | UpdatePromotionData) => {
    try {
      setLoading(true)
      setError(null)
      
      if (isEditMode && promotionId) {
        // Update existing promotion
        await updatePromotion(promotionId, data as UpdatePromotionData)
      } else {
        // Create new promotion
        await createPromotion(data as CreatePromotionData)
      }
      
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : isEditMode ? 'خطا در بروزرسانی تبلیغ' : 'خطا در ایجاد تبلیغ')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setError(null)
  }

  const promotionTypeOptions = [
    { code: PromotionType.COUPON, name: 'کوپن' },
    { code: PromotionType.CASHBACK, name: 'کش بک' },
    { code: PromotionType.REFERRAL, name: 'معرفی دوست' },
    { code: PromotionType.CONDITIONAL, name: 'شرطی' },
    { code: PromotionType.PERCENTAGE, name: 'درصدی' },
    { code: PromotionType.FIXED, name: 'مبلغ ثابت' },
    { code: PromotionType.FLASH_SALE, name: 'فروش فلش' },
    { code: PromotionType.FREE_SHIPPING, name: 'ارسال رایگان' },
    { code: PromotionType.LOYALTY_POINTS, name: 'امتیاز وفاداری' },
    { code: PromotionType.BEHAVIORAL, name: 'رفتاری' },
    { code: PromotionType.STACKABLE, name: 'قابل ترکیب' }
  ]

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      onAccept={methods.handleSubmit(onSubmit)}
      onReject={handleClose}
      title={isEditMode ? 'ویرایش تبلیغ' : 'افزودن تبلیغ جدید'}
      acceptBtnText={isEditMode ? 'بروزرسانی تبلیغ' : 'ایجاد تبلیغ'}
      rejectBtnText="انصراف"
      acceptBtnColor="success"
      size="xl"
    >
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        <FormProvider {...methods}>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">اطلاعات پایه</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  generalType="select"
                  name="type"
                  label="نوع تبلیغ"
                  options={promotionTypeOptions}
                  required={true}
                />
                
                <Input
                  generalType="input"
                  name="title"
                  label="عنوان تبلیغ"
                  placeholder="عنوان تبلیغ"
                  inputType="text"
                  required={true}
                />
              </div>
              
              <Input
                generalType="textarea"
                name="description"
                label="توضیحات"
                placeholder="توضیحات تبلیغ"
              />
            </div>

            {/* Value and Limits */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">مقادیر و محدودیت‌ها</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  generalType="input"
                  name="value"
                  label="مقدار تخفیف"
                  placeholder="0"
                  inputType="number"
                />
                
                <Input
                  generalType="input"
                  name="minPurchaseAmount"
                  label="حداقل مبلغ خرید"
                  placeholder="0"
                  inputType="number"
                />
                
                <Input
                  generalType="input"
                  name="maxDiscountAmount"
                  label="حداکثر مبلغ تخفیف"
                  placeholder="0"
                  inputType="number"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  generalType="input"
                  name="usageLimit"
                  label="حد مجاز استفاده"
                  placeholder="0"
                  inputType="number"
                />
                
                <Input
                  generalType="input"
                  name="maxUsagePerCustomer"
                  label="حد مجاز استفاده برای هر مشتری"
                  placeholder="0"
                  inputType="number"
                />
              </div>
            </div>

            {/* Special Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">فیلدهای خاص</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  generalType="input"
                  name="code"
                  label="کد تبلیغ"
                  placeholder="کد تبلیغ"
                  inputType="text"
                />
                
                <Input
                  generalType="input"
                  name="points"
                  label="امتیاز وفاداری"
                  placeholder="0"
                  inputType="number"
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">بازه زمانی</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  generalType="input"
                  name="startDate"
                  label="تاریخ شروع"
                  inputType="datetime-local"
                />
                
                <Input
                  generalType="input"
                  name="endDate"
                  label="تاریخ پایان"
                  inputType="datetime-local"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">شرایط و قوانین</h3>
              <Input
                generalType="textarea"
                name="termsAndConditions"
                label="شرایط و قوانین"
                placeholder="شرایط و قوانین استفاده از تبلیغ"
              />
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">گزینه‌ها</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  generalType="checkbox"
                  name="isStackable"
                  label="قابل ترکیب با سایر تبلیغات"
                />
                
                <Input
                  generalType="checkbox"
                  name="requiresApproval"
                  label="نیاز به تایید دستی"
                />
              </div>
            </div>
          </div>
        </FormProvider>
      </div>
    </Modal>
  )
}

export default PromotionFormModal

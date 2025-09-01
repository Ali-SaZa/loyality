'use client'
import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Modal from './Modal'
import Input from '@/components/formElements/Input'
import useLoading from '@/hooks/useLoading'
import { CreatePromotionValidation, UpdatePromotionValidation, CreatePromotionData, UpdatePromotionData } from '@/validation/promotion'
import { PromotionType } from '@/types/enums'
import { Promotion, getPromotionById, createPromotion, updatePromotion } from '@/services/promotions'
import { Store } from '@/services/stores'

interface PromotionFormModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSuccess?: () => void
  promotionId?: string // If provided, it's edit mode
  stores: Store[]
}

const PromotionFormModal = ({ isOpen, onOpenChange, onSuccess, promotionId, stores }: PromotionFormModalProps) => {
  const { setLoading } = useLoading()
  const [promotion, setPromotion] = useState<Promotion | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>('')

  const isEditMode = !!promotionId

  const methods = useForm<CreatePromotionData | UpdatePromotionData>({
    resolver: zodResolver(isEditMode ? UpdatePromotionValidation : CreatePromotionValidation),
    defaultValues: {
      storeId: '',
      type: PromotionType.COUPON,
      title: '',
      description: '',
      value: undefined,
      minPurchaseAmount: undefined,
      maxDiscountAmount: undefined,
      code: '',
      points: undefined,
      startDate: '',
      endDate: '',
      usageLimit: undefined,
      maxUsagePerCustomer: undefined,
      isStackable: false,
      stackableWith: [],
      termsAndConditions: '',
      requiresApproval: false,
      applicableEvents: []
    }
  })

  const watchType = methods.watch('type')

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && promotionId) {
        fetchPromotion(promotionId)
      } else {
        // Reset form for create mode
        methods.reset({
          storeId: '',
          type: PromotionType.COUPON,
          title: '',
          description: '',
          value: undefined,
          minPurchaseAmount: undefined,
          maxDiscountAmount: undefined,
          code: '',
          points: undefined,
          startDate: '',
          endDate: '',
          usageLimit: undefined,
          maxUsagePerCustomer: undefined,
          isStackable: false,
          stackableWith: [],
          termsAndConditions: '',
          requiresApproval: false,
          applicableEvents: []
        })
        setSelectedType(PromotionType.COUPON)
        setError(null)
      }
    }
  }, [isOpen, isEditMode, promotionId])

  useEffect(() => {
    setSelectedType(watchType)
  }, [watchType])

  const fetchPromotion = async (promotionId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const promotionData = await getPromotionById(promotionId)
      setPromotion(promotionData)
      setSelectedType(promotionData.type)
      
      methods.reset({
        title: promotionData.title,
        description: promotionData.description || '',
        value: promotionData.value,
        minPurchaseAmount: promotionData.minPurchaseAmount,
        maxDiscountAmount: promotionData.maxDiscountAmount,
        usageLimit: promotionData.usageLimit,
        maxUsagePerCustomer: promotionData.maxUsagePerCustomer,
        isStackable: promotionData.isStackable || false,
        stackableWith: promotionData.stackableWith || [],
        termsAndConditions: promotionData.termsAndConditions || '',
        requiresApproval: promotionData.requiresApproval || false,
        applicableEvents: promotionData.applicableEvents || []
      })
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

  const storeOptions = stores.map(store => ({
    code: store.id,
    name: store.name
  }))

  const typeOptions = [
    { code: PromotionType.COUPON, name: 'کوپن / کد تخفیف' },
    { code: PromotionType.CASHBACK, name: 'کش بک' },
    { code: PromotionType.REFERRAL, name: 'معرفی دوست' },
    { code: PromotionType.CONDITIONAL, name: 'شرطی / پلکانی' },
    { code: PromotionType.PERCENTAGE, name: 'درصدی' },
    { code: PromotionType.FIXED, name: 'مبلغ ثابت' },
    { code: PromotionType.FLASH_SALE, name: 'فروش فلش' },
    { code: PromotionType.FREE_SHIPPING, name: 'ارسال رایگان' },
    { code: PromotionType.LOYALTY_POINTS, name: 'امتیاز وفاداری' },
    { code: PromotionType.BEHAVIORAL, name: 'رفتاری / رویداد محور' },
    { code: PromotionType.STACKABLE, name: 'قابل ترکیب' }
  ]

  const stackableTypeOptions = typeOptions.filter(option => option.code !== selectedType)

  const eventOptions = [
    { code: 'birthday', name: 'تولد مشتری' },
    { code: 'first_login', name: 'ورود اول به اپ' },
    { code: 'monthly_login', name: 'ورود ماهانه' },
    { code: 'purchase_milestone', name: 'دستاورد خرید' },
    { code: 'referral', name: 'معرفی دوست' },
    { code: 'holiday', name: 'تعطیلات' }
  ]

  const renderTypeSpecificFields = () => {
    switch (selectedType) {
      case PromotionType.COUPON:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              generalType="input"
              name="code"
              label="کد تخفیف"
              placeholder="مثال: OFF10"
              inputType="text"
              description="کد باید ۳ تا ۲۰ کاراکتر و شامل حروف بزرگ و اعداد باشد"
              required={true}
            />
            <Input
              generalType="input"
              name="value"
              label="مقدار تخفیف"
              placeholder="مثال: 10"
              inputType="number"
              description="درصد یا مبلغ تخفیف"
              required={true}
            />
          </div>
        )

      case PromotionType.LOYALTY_POINTS:
        return (
          <div className="grid grid-cols-1 gap-6">
            <Input
              generalType="input"
              name="points"
              label="امتیاز"
              placeholder="مثال: 100"
              inputType="number"
              description="تعداد امتیازهای اعطایی"
              required={true}
            />
          </div>
        )

      case PromotionType.FLASH_SALE:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              generalType="input"
              name="value"
              label="مقدار تخفیف"
              placeholder="مثال: 30"
              inputType="number"
              description="درصد تخفیف"
              required={true}
            />
            <Input
              generalType="input"
              name="startDate"
              label="تاریخ شروع"
              placeholder="تاریخ شروع را انتخاب کنید"
              inputType="text"
              required={true}
            />
            <Input
              generalType="input"
              name="endDate"
              label="تاریخ پایان"
              placeholder="تاریخ پایان را انتخاب کنید"
              inputType="text"
              required={true}
            />
          </div>
        )

      case PromotionType.BEHAVIORAL:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              generalType="input"
              name="value"
              label="مقدار تخفیف"
              placeholder="مثال: 10"
              inputType="number"
              description="درصد یا مبلغ تخفیف"
              required={true}
            />
            <Input
              generalType="select"
              name="applicableEvents"
              label="رویدادهای قابل اعمال"
              placeholder="رویدادها را انتخاب کنید"
              selectOptions={eventOptions}
              selectKey="code"
              selectValue="name"
              multiple={true}
              description="رویدادهایی که این تخفیف برای آنها اعمال می‌شود"
              required={true}
            />
          </div>
        )

      case PromotionType.STACKABLE:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              generalType="input"
              name="value"
              label="مقدار تخفیف"
              placeholder="مثال: 10"
              inputType="number"
              description="درصد یا مبلغ تخفیف"
              required={true}
            />
            <Input
              generalType="select"
              name="stackableWith"
              label="قابل ترکیب با"
              placeholder="انواع تبلیغات را انتخاب کنید"
              selectOptions={stackableTypeOptions}
              selectKey="code"
              selectValue="name"
              multiple={true}
              description="انواع تبلیغاتی که این تبلیغ می‌تواند با آنها ترکیب شود"
              required={true}
            />
          </div>
        )

      case PromotionType.CONDITIONAL:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              generalType="input"
              name="value"
              label="مقدار تخفیف"
              placeholder="مثال: 10"
              inputType="number"
              description="درصد تخفیف"
              required={true}
            />
            <Input
              generalType="input"
              name="minPurchaseAmount"
              label="حداقل مبلغ خرید"
              placeholder="مثال: 500000"
              inputType="number"
              description="حداقل مبلغ خرید برای اعمال تخفیف"
              required={true}
            />
          </div>
        )

      default:
        return (
          <div className="grid grid-cols-1 gap-6">
            <Input
              generalType="input"
              name="value"
              label="مقدار تخفیف"
              placeholder="مثال: 10"
              inputType="number"
              description="درصد یا مبلغ تخفیف"
              required={true}
            />
          </div>
        )
    }
  }

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
      acceptBtnColor="primary"
      size="2xl"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                generalType="select"
                name="storeId"
                label="فروشگاه"
                placeholder="فروشگاه را انتخاب کنید"
                selectOptions={storeOptions}
                selectKey="code"
                selectValue="name"
                required={true}
                disabled={isEditMode}
              />

              <Input
                generalType="select"
                name="type"
                label="نوع تبلیغ"
                placeholder="نوع تبلیغ را انتخاب کنید"
                selectOptions={typeOptions}
                selectKey="code"
                selectValue="name"
                required={true}
                disabled={isEditMode}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                generalType="input"
                name="title"
                label="عنوان تبلیغ"
                placeholder="عنوان تبلیغ را وارد کنید"
                inputType="text"
                required={true}
              />
              
              <Input
                generalType="input"
                name="description"
                label="توضیحات"
                placeholder="توضیحات تبلیغ (اختیاری)"
                inputType="text"
              />
            </div>

            {/* Type-specific fields */}
            {renderTypeSpecificFields()}

            {/* Additional fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                generalType="input"
                name="maxDiscountAmount"
                label="حداکثر مبلغ تخفیف"
                placeholder="مثال: 50000"
                inputType="number"
                description="حداکثر مبلغ تخفیف قابل اعمال"
              />

              <Input
                generalType="input"
                name="usageLimit"
                label="حد مجاز استفاده"
                placeholder="مثال: 100"
                inputType="number"
                description="تعداد کل دفعات قابل استفاده"
              />

              <Input
                generalType="input"
                name="maxUsagePerCustomer"
                label="حد مجاز برای هر مشتری"
                placeholder="مثال: 1"
                inputType="number"
                description="تعداد دفعات قابل استفاده برای هر مشتری"
              />
            </div>

            {/* Date fields for non-flash sale types */}
            {selectedType !== PromotionType.FLASH_SALE && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
              generalType="input"
              name="startDate"
              label="تاریخ شروع (اختیاری)"
              placeholder="تاریخ شروع را انتخاب کنید"
              inputType="text"
            />
            <Input
              generalType="input"
              name="endDate"
              label="تاریخ پایان (اختیاری)"
              placeholder="تاریخ پایان را انتخاب کنید"
              inputType="text"
            />
              </div>
            )}

            {/* Stackable options */}
            {selectedType !== PromotionType.STACKABLE && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  generalType="select"
                  name="isStackable"
                  label="قابل ترکیب"
                  placeholder="آیا این تبلیغ قابل ترکیب است؟"
                  selectOptions={[
                    { code: true, name: 'بله' },
                    { code: false, name: 'خیر' }
                  ]}
                  selectKey="code"
                  selectValue="name"
                />

                {methods.watch('isStackable') && (
                  <Input
                    generalType="select"
                    name="stackableWith"
                    label="قابل ترکیب با"
                    placeholder="انواع تبلیغات را انتخاب کنید"
                    selectOptions={stackableTypeOptions}
                    selectKey="code"
                    selectValue="name"
                    multiple={true}
                    description="انواع تبلیغاتی که این تبلیغ می‌تواند با آنها ترکیب شود"
                  />
                )}
              </div>
            )}

            {/* Terms and approval */}
            <div className="grid grid-cols-1 gap-6">
              <Input
                generalType="textarea"
                name="termsAndConditions"
                label="شرایط و قوانین"
                placeholder="شرایط و قوانین تبلیغ را وارد کنید"
                description="شرایط و قوانین استفاده از این تبلیغ"
              />

              <Input
                generalType="select"
                name="requiresApproval"
                label="نیاز به تایید"
                placeholder="آیا این تبلیغ نیاز به تایید دارد؟"
                selectOptions={[
                  { code: true, name: 'بله' },
                  { code: false, name: 'خیر' }
                ]}
                selectKey="code"
                selectValue="name"
                description="در صورت فعال بودن، استفاده از این تبلیغ نیاز به تایید ادمین دارد"
              />
            </div>
          </div>
        </FormProvider>
      </div>
    </Modal>
  )
}

export default PromotionFormModal

'use client'
import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Modal from './Modal'
import Input from '@/components/formElements/Input'
import useLoading from '@/hooks/useLoading'
import { CreatePromotionValidation, CreatePromotionData } from '@/validation/promotion'
import { PromotionType, PROMOTION_TYPE_OPTIONS } from '@/types/enums'
import { createPromotion } from '@/services/promotions'

interface PromotionDetailsModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSuccess?: () => void
  basicData: { storeId: string; type: string; title: string; description?: string }
}

const PromotionDetailsModal = ({ isOpen, onOpenChange, onSuccess, basicData }: PromotionDetailsModalProps) => {
  const { setLoading } = useLoading()
  const [error, setError] = useState<string | null>(null)

  const methods = useForm<Omit<CreatePromotionData, 'storeId' | 'type' | 'title' | 'description'>>({
    resolver: zodResolver(CreatePromotionValidation.omit({ storeId: true, type: true, title: true, description: true })),
    defaultValues: {
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

  const onSubmit = async (data: Omit<CreatePromotionData, 'storeId' | 'type' | 'title' | 'description'>) => {
    try {
      console.log('Form submitted with data:', { ...basicData, ...data })
      setLoading(true)
      setError(null)
      
      // Transform the data for API
      const transformedData: any = {
        ...basicData,
        ...data,
        // Convert string values to numbers where needed
        value: data.value ? Number(data.value) : undefined,
        minPurchaseAmount: data.minPurchaseAmount ? Number(data.minPurchaseAmount) : undefined,
        maxDiscountAmount: data.maxDiscountAmount ? Number(data.maxDiscountAmount) : undefined,
        points: data.points ? Number(data.points) : undefined,
        usageLimit: data.usageLimit ? Number(data.usageLimit) : undefined,
        maxUsagePerCustomer: data.maxUsagePerCustomer ? Number(data.maxUsagePerCustomer) : undefined,
        // Handle boolean fields properly
        isStackable: Boolean(data.isStackable),
        requiresApproval: Boolean(data.requiresApproval),
        // For stackable type, ensure isStackable is true
        ...(basicData?.type === PromotionType.STACKABLE && { isStackable: true })
      }
      
      console.log('Transformed data:', transformedData)
      
      await createPromotion(transformedData as CreatePromotionData)
      
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      console.error('Error submitting form:', err)
      setError(err instanceof Error ? err.message : 'خطا در ایجاد تبلیغ')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setError(null)
    methods.reset()
  }

  const typeOptions = PROMOTION_TYPE_OPTIONS

  const stackableTypeOptions = basicData ? typeOptions.filter(option => option.code !== basicData.type) : []

  const eventOptions = [
    { code: 'birthday', name: 'تولد مشتری' },
    { code: 'first_login', name: 'ورود اول به اپ' },
    { code: 'monthly_login', name: 'ورود ماهانه' },
    { code: 'purchase_milestone', name: 'دستاورد خرید' },
    { code: 'referral', name: 'معرفی دوست' },
    { code: 'holiday', name: 'تعطیلات' }
  ]

  const renderTypeSpecificFields = () => {
    if (!basicData) return null
    
    switch (basicData.type) {
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
              description="فرمت: YYYY-MM-DD"
              required={true}
            />
            <Input
              generalType="input"
              name="endDate"
              label="تاریخ پایان"
              placeholder="تاریخ پایان را انتخاب کنید"
              inputType="text"
              description="فرمت: YYYY-MM-DD"
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
      onAccept={() => methods.handleSubmit(onSubmit)()}
      onReject={handleClose}
      title={`جزئیات تبلیغ ${basicData ? typeOptions.find(t => t.code === basicData.type)?.name : ''}`}
      acceptBtnText="ایجاد تبلیغ"
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

        {/* Display basic info */}
        <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <h3 className="font-semibold text-primary mb-2">اطلاعات اولیه</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">فروشگاه:</span> {basicData.storeId}
            </div>
            <div>
              <span className="font-medium">نوع:</span> {typeOptions.find(t => t.code === basicData.type)?.name}
            </div>
            <div>
              <span className="font-medium">عنوان:</span> {basicData.title}
            </div>
            {basicData.description && (
              <div>
                <span className="font-medium">توضیحات:</span> {basicData.description}
              </div>
            )}
          </div>
        </div>

        <FormProvider {...methods}>
          <div className="space-y-6">
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
            {basicData.type !== PromotionType.FLASH_SALE && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  generalType="input"
                  name="startDate"
                  label="تاریخ شروع (اختیاری)"
                  placeholder="تاریخ شروع را انتخاب کنید"
                  inputType="text"
                  description="فرمت: YYYY-MM-DD"
                />
                <Input
                  generalType="input"
                  name="endDate"
                  label="تاریخ پایان (اختیاری)"
                  placeholder="تاریخ پایان را انتخاب کنید"
                  inputType="text"
                  description="فرمت: YYYY-MM-DD"
                />
              </div>
            )}

            {/* Stackable options */}
            {basicData.type !== PromotionType.STACKABLE && (
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

export default PromotionDetailsModal

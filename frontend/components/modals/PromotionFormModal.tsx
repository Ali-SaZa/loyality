'use client'
import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Modal from './Modal'
import Input from '@/components/formElements/Input'
import useLoading from '@/hooks/useLoading'
import { CreatePromotionValidation, UpdatePromotionValidation, CreatePromotionData, UpdatePromotionData } from '@/validation/promotion'
import { Promotion, getPromotionById, createPromotion, updatePromotion, CreatePromotionRequest, UpdatePromotionRequest } from '@/services/promotions'
import { Store } from '@/services/stores'

interface PromotionFormModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSuccess?: () => void
  onPromotionCreated?: (promotionId: string, storeName: string) => void
  promotionId?: string // If provided, it's edit mode
  stores: Store[]
}

const PromotionFormModal = ({ isOpen, onOpenChange, onSuccess, onPromotionCreated, promotionId, stores }: PromotionFormModalProps) => {
  const { setLoading } = useLoading()
  const [promotion, setPromotion] = useState<Promotion | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isEditMode = !!promotionId

  const methods = useForm<CreatePromotionData | UpdatePromotionData>({
    resolver: zodResolver(isEditMode ? UpdatePromotionValidation : CreatePromotionValidation),
    defaultValues: {
      storeId: '',
      title: '',
      description: '',
      price: 0,
      points: 0
    }
  })

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && promotionId) {
        fetchPromotion(promotionId)
      } else {
        // Reset form for create mode
        methods.reset({
          storeId: '',
          title: '',
          description: '',
          price: 0,
          points: 0
        })
        setError(null)
      }
    }
  }, [isOpen, isEditMode, promotionId])

  const fetchPromotion = async (promotionId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const promotionData = await getPromotionById(promotionId)
      setPromotion(promotionData)
      
      methods.reset({
        storeId: promotionData.storeId,
        title: promotionData.title,
        description: promotionData.description || '',
        price: promotionData.price,
        points: promotionData.points
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری اطلاعات تبلیغ')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: CreatePromotionData | UpdatePromotionData) => {
    try {
      console.log('Form submitted with data:', data)
      setLoading(true)
      setError(null)
      
      // Transform the data for API
      const transformedData: any = {
        ...data,
        // Convert string values to numbers where needed
        price: typeof data.price === 'number' ? data.price : Number(data.price),
        points: typeof data.points === 'number' ? data.points : Number(data.points)
      }
      
      // Remove any undefined values to clean up the object
      Object.keys(transformedData).forEach(key => {
        if (transformedData[key] === undefined) {
          delete transformedData[key]
        }
      })
      
      console.log('Transformed data:', transformedData)
      
      if (isEditMode && promotionId) {
        // Update existing promotion
        await updatePromotion(promotionId, transformedData as UpdatePromotionRequest)
      } else {
        // Create new promotion
        const createdPromotion = await createPromotion(transformedData as CreatePromotionRequest)
        
        // Get store name for the created promotion
        const selectedStore = stores.find(store => store.id === transformedData.storeId)
        const storeName = selectedStore?.name || 'Unknown Store'
        
        // Call the callback to trigger automatic promo code creation
        onPromotionCreated?.(createdPromotion.id, storeName)
      }
      
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      console.error('Error submitting form:', err)
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

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      onAccept={methods.handleSubmit(onSubmit)}
      onReject={handleClose}
      title={isEditMode ? 'ویرایش تبلیغ امتیازی' : 'افزودن تبلیغ امتیازی جدید'}
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
                generalType="input"
                name="title"
                label="عنوان تبلیغ"
                placeholder="عنوان تبلیغ را وارد کنید"
                inputType="text"
                required={true}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Input
                generalType="input"
                name="description"
                label="توضیحات"
                placeholder="توضیحات تبلیغ (اختیاری)"
                inputType="text"
              />
            </div>

            {/* Price and Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                generalType="input"
                name="price"
                label="مبلغ خرید (تومان)"
                placeholder="مثال: 100000"
                inputType="number"
                description="مبلغی که مشتری باید خرید کند"
                required={true}
              />

              <Input
                generalType="input"
                name="points"
                label="امتیاز اعطایی"
                placeholder="مثال: 1"
                inputType="number"
                description="تعداد امتیازی که برای این خرید اعطا می‌شود"
                required={true}
              />
            </div>

            {/* Example display */}
            <div className="p-4 bg-info-50 border border-info-200 rounded-lg">
              <p className="text-info text-sm">
                <strong>مثال:</strong> اگر مبلغ خرید ۱۰۰,۰۰۰ تومان و امتیاز ۱ باشد، 
                مشتری با خرید ۱۰۰,۰۰۰ تومان، ۱ امتیاز دریافت می‌کند.
              </p>
            </div>
          </div>
        </FormProvider>
      </div>
    </Modal>
  )
}

export default PromotionFormModal

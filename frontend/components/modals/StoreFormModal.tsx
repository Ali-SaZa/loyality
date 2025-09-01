'use client'
import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Modal from './Modal'
import Input from '@/components/formElements/Input'
import useLoading from '@/hooks/useLoading'
import { StoreFormValidation, StoreUpdateValidation, StoreFormData, StoreUpdateData } from '@/validation/store'
import { StorePlanType } from '@/types/enums'
import { Store, getStoreById, createStore, updateStore, storesService } from '@/services/stores'

interface StoreFormModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSuccess?: () => void
  storeId?: string // If provided, it's edit mode
}

const StoreFormModal = ({ isOpen, onOpenChange, onSuccess, storeId }: StoreFormModalProps) => {
  const { setLoading } = useLoading()
  const [store, setStore] = useState<Store | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isEditMode = !!storeId

  const methods = useForm<StoreFormData | StoreUpdateData>({
    resolver: zodResolver(isEditMode ? StoreUpdateValidation : StoreFormValidation),
    defaultValues: {
      name: '',
      ownerName: '',
      phoneNumber: '',
      userId: '',
      address: {
        city: '',
        street: '',
        coordinates: {
          lat: 0,
          lng: 0
        }
      },
      loyaltySettings: {
        tiers: [
          {
            minAmount: 0,
            rewardType: 'cashback',
            value: 5,
            description: 'پاداش پایه'
          }
        ],
        lotteryFrequency: 'none',
        defaultCashbackRate: 5
      },
      plan: {
        type: 'free',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    }
  })

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && storeId) {
        fetchStore(storeId)
      } else {
        // Reset form for create mode
        methods.reset({
          name: '',
          ownerName: '',
          phoneNumber: '',
          userId: '',
          address: {
            city: '',
            street: '',
            coordinates: {
              lat: 0,
              lng: 0
            }
          },
          loyaltySettings: {
            tiers: [
              {
                minAmount: 0,
                rewardType: 'cashback',
                value: 5,
                description: 'پاداش پایه'
              }
            ],
            lotteryFrequency: 'none',
            defaultCashbackRate: 5
          },
          plan: {
            type: 'free',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        })
        setError(null)
      }
    }
  }, [isOpen, isEditMode, storeId])

  const fetchStore = async (storeId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const storeData = await getStoreById(storeId)
      setStore(storeData)
      
      methods.reset({
        name: storeData.name,
        ownerName: storeData.ownerName,
        phoneNumber: storeData.phoneNumber,
        userId: storeData.userId,
        address: storeData.address,
        loyaltySettings: storeData.loyaltySettings,
        plan: storeData.plan
      } as any)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری اطلاعات فروشگاه')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: StoreFormData | StoreUpdateData) => {
    try {
      setLoading(true)
      setError(null)
      
      if (isEditMode && storeId) {
        // Update existing store
        await updateStore(storeId, data as StoreUpdateData)
      } else {
        // Create new store
        await createStore(data as StoreFormData)
      }
      
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : isEditMode ? 'خطا در بروزرسانی فروشگاه' : 'خطا در ایجاد فروشگاه')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setError(null)
  }

  const planOptions = [
    { code: 'free', name: 'رایگان' },
    { code: 'premium', name: 'پریمیوم' }
  ]

  const rewardTypeOptions = [
    { code: 'cashback', name: 'کش بک' },
    { code: 'discount', name: 'تخفیف' },
    { code: 'lottery', name: 'قرعه کشی' }
  ]

  const lotteryFrequencyOptions = [
    { code: 'none', name: 'هیچ' },
    { code: 'weekly', name: 'هفتگی' },
    { code: 'monthly', name: 'ماهانه' }
  ]

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      onAccept={methods.handleSubmit(onSubmit)}
      onReject={handleClose}
      title={isEditMode ? 'ویرایش فروشگاه' : 'افزودن فروشگاه جدید'}
      acceptBtnText={isEditMode ? 'بروزرسانی فروشگاه' : 'ایجاد فروشگاه'}
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
            {/* Store Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                generalType="input"
                name="name"
                label="نام فروشگاه"
                placeholder="نام فروشگاه"
                inputType="text"
                required={true}
              />
              
              <Input
                generalType="input"
                name="ownerName"
                label="نام صاحب فروشگاه"
                placeholder="نام صاحب فروشگاه"
                inputType="text"
                required={true}
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                generalType="input"
                name="phoneNumber"
                label="شماره تلفن"
                placeholder="09XXXXXXXXX"
                inputType="tel"
                description="شماره تلفن باید با 09 شروع شود"
                required={true}
              />
              
              <Input
                generalType="input"
                name="userId"
                label="شناسه کاربر"
                placeholder="شناسه کاربر فروشگاه"
                inputType="text"
                required={true}
                disabled={isEditMode}
              />
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                generalType="input"
                name="address.city"
                label="شهر"
                placeholder="شهر"
                inputType="text"
                required={true}
              />
              
              <Input
                generalType="input"
                name="address.street"
                label="آدرس"
                placeholder="آدرس فروشگاه"
                inputType="text"
              />
            </div>

            {/* Plan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                generalType="select"
                name="plan.type"
                label="نوع پلن"
                placeholder="نوع پلن را انتخاب کنید"
                selectOptions={planOptions}
                selectKey="code"
                selectValue="name"
                required={true}
              />
              
              <Input
                generalType="input"
                name="plan.startDate"
                label="تاریخ شروع"
                placeholder="تاریخ شروع پلن"
                inputType="date"
                required={true}
              />
              
              <Input
                generalType="input"
                name="plan.endDate"
                label="تاریخ پایان"
                placeholder="تاریخ پایان پلن"
                inputType="date"
                required={true}
              />
            </div>

            {/* Loyalty Settings */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-text-dark">تنظیمات وفاداری</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  generalType="select"
                  name="loyaltySettings.lotteryFrequency"
                  label="فرکانس قرعه کشی"
                  placeholder="فرکانس قرعه کشی را انتخاب کنید"
                  selectOptions={lotteryFrequencyOptions}
                  selectKey="code"
                  selectValue="name"
                  required={true}
                />
                
                <Input
                  generalType="input"
                  name="loyaltySettings.defaultCashbackRate"
                  label="نرخ کش بک پیش فرض (%)"
                  placeholder="نرخ کش بک"
                  inputType="number"
                  required={true}
                />
              </div>

              {/* Loyalty Tiers */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-text-dark">سطوح وفاداری</label>
                <div className="space-y-3 p-4 border border-divider rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                      generalType="input"
                      name="loyaltySettings.tiers.0.minAmount"
                      label="حداقل مبلغ"
                      placeholder="حداقل مبلغ"
                      inputType="number"
                      required={true}
                    />
                    
                    <Input
                      generalType="select"
                      name="loyaltySettings.tiers.0.rewardType"
                      label="نوع پاداش"
                      placeholder="نوع پاداش"
                      selectOptions={rewardTypeOptions}
                      selectKey="code"
                      selectValue="name"
                      required={true}
                    />
                    
                    <Input
                      generalType="input"
                      name="loyaltySettings.tiers.0.value"
                      label="مقدار پاداش"
                      placeholder="مقدار پاداش"
                      inputType="number"
                      required={true}
                    />
                    
                    <Input
                      generalType="input"
                      name="loyaltySettings.tiers.0.description"
                      label="توضیحات"
                      placeholder="توضیحات پاداش"
                      inputType="text"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FormProvider>
      </div>
    </Modal>
  )
}

export default StoreFormModal

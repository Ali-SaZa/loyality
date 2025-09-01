'use client'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Modal from './Modal'
import Input from '@/components/formElements/Input'
import { BasicPromotionValidation } from '@/validation/promotion'
import { PromotionType, PROMOTION_TYPE_OPTIONS } from '@/types/enums'
import { Store } from '@/services/stores'

type BasicPromotionData = {
  storeId: string
  type: 'coupon' | 'cashback' | 'referral' | 'conditional' | 'percentage' | 'fixed' | 'flashSale' | 'freeShipping' | 'loyaltyPoints' | 'behavioral' | 'stackable'
  title: string
  description?: string
}

interface PromotionBasicModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onNext: (data: BasicPromotionData) => void
  stores: Store[]
}

const PromotionBasicModal = ({ isOpen, onOpenChange, onNext, stores }: PromotionBasicModalProps) => {
  const methods = useForm<BasicPromotionData>({
    resolver: zodResolver(BasicPromotionValidation),
    defaultValues: {
      storeId: '',
      type: PromotionType.COUPON,
      title: '',
      description: ''
    }
  })

  const onSubmit = (data: BasicPromotionData) => {
    console.log('Basic modal submitted:', data)
    onNext(data)
  }

  const handleSubmit = methods.handleSubmit(onSubmit)

  const handleAccept = () => {
    console.log('Accept button clicked')
    handleSubmit()
  }

  const handleClose = () => {
    onOpenChange(false)
    methods.reset()
  }

  const storeOptions = stores.map(store => ({
    code: store.id,
    name: store.name
  }))

  const typeOptions = PROMOTION_TYPE_OPTIONS

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      onAccept={handleAccept}
      onReject={handleClose}
      title="اطلاعات اولیه تبلیغ"
      acceptBtnText="مرحله بعد"
      rejectBtnText="انصراف"
      acceptBtnColor="primary"
      size="lg"
    >
      <div className="space-y-6">
        <FormProvider {...methods}>
          <div className="space-y-6">
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
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
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
          </div>
        </FormProvider>
      </div>
    </Modal>
  )
}

export default PromotionBasicModal

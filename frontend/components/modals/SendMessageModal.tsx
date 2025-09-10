'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'

import Modal from './Modal'
import Input from '@/components/formElements/Input'
import Button from '@/components/formElements/Button'
import { sendSmsToCustomer, SendSmsRequest } from '@/services/stores'
import { SendMessageValidation, SendMessageData } from '@/validation/sendMessage'
import useLoading from '@/hooks/useLoading'

interface SendMessageModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  customerId: string
  customerName: string
  onSuccess?: () => void
}

const SendMessageModal = ({
  isOpen,
  onOpenChange,
  customerId,
  customerName,
  onSuccess,
}: SendMessageModalProps) => {
  const { setLoading } = useLoading()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const methods = useForm<SendMessageData>({
    resolver: zodResolver(SendMessageValidation),
    defaultValues: {
      text: '',
    },
  })

  const onSubmit = async (data: SendMessageData) => {
    try {
      setIsSubmitting(true)
      setError(null)

      const smsData: SendSmsRequest = {
        userId: customerId,
        text: data.text,
      }

      await sendSmsToCustomer(smsData)
      
      toast.success('پیام با موفقیت ارسال شد')
      onOpenChange(false)
      methods.reset()
      onSuccess?.()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در ارسال پیام'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false)
      methods.reset()
      setError(null)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      title={`ارسال پیام به ${customerName}`}
      size="md"
      acceptBtnText="ارسال پیام"
      rejectBtnText="انصراف"
      acceptBtnColor="primary"
      acceptBtnDisabled={isSubmitting}
      rejectBtnDisabled={isSubmitting}
      isLoading={isSubmitting}
      onAccept={methods.handleSubmit(onSubmit)}
      onReject={handleClose}
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-700">
            پیام شما به شماره تلفن مشتری ارسال خواهد شد. حداکثر ۱۶۰ کاراکتر مجاز است.
          </p>
        </div>

        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <Input
            generalType="textarea"
            name="text"
            label="متن پیام"
            placeholder="متن پیام خود را وارد کنید..."
            required
            description={`${methods.watch('text')?.length || 0}/160 کاراکتر`}
          />
        </form>
      </div>
    </Modal>
  )
}

export default SendMessageModal

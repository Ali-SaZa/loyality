'use client'
import React, { useState } from 'react'
import { useDisclosure } from '@nextui-org/modal'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import Input from '../formElements/Input'

import { CommentFormValidation } from '@/validation/comment'
import { SAVE_USER_COMMENT } from '@/services/simulationUser'
import Modal from '@/components/modals/Modal'

interface SimulatorSortModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  jobSimulationUserId: string
  onCommentSent?: () => void
}

const CommentDefaultValues = {
  comment: '',
}

const CommentModal = ({ isOpen, setIsOpen, jobSimulationUserId, onCommentSent }: SimulatorSortModalProps) => {
  const { onOpenChange } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)

  const commentForm = useForm<z.infer<typeof CommentFormValidation>>({
    resolver: zodResolver(CommentFormValidation),
    defaultValues: {
      ...CommentDefaultValues,
    },
  })

  const sendComment = async (data: z.infer<typeof CommentFormValidation>) => {
    try {
      setIsLoading(true)
      await SAVE_USER_COMMENT(jobSimulationUserId, data)
      toast.success('نظر شما با موفقیت ثبت شد.')
      setIsOpen(false)
      if (onCommentSent) {
        onCommentSent()
      }
      commentForm.reset()
    } catch (error) {
      console.log('error', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      acceptBtnText="ارسال"
      headerClassName="border-none font-semibold"
      isLoading={isLoading}
      isOpen={isOpen}
      size="lg"
      title="نظر شما از این شبیه ساز"
      onAccept={commentForm.handleSubmit(sendComment)}
      onClose={() => {
        setIsOpen(false)
        commentForm.reset()
      }}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col gap-6">
        <p className="text-text-dark text-sm text-center">ممنون میشویم اگر نظر خود را در رابطه با این شبیه ساز بیان کنید.</p>
        <FormProvider {...commentForm}>
          <form onSubmit={commentForm.handleSubmit(sendComment)}>
            <Input
              required
              generalType="textarea"
              name="comment"
              placeholder="نظر مربوطه..."
              size="lg"
            />
          </form>
        </FormProvider>
      </div>
    </Modal>
  )
}

export default CommentModal

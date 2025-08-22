import React from 'react'
import toast from 'react-hot-toast'

import Button from '@/components/formElements/Button'
import CopyIcon from '@/components/icons/CopyIcon'
import { convertToDateString, fileAddress } from '@/helpers'
import useAuth from '@/hooks/useAuth'

interface MessageCardProps {
  chat: {
    userId: string
    message: string
    sentAt: string
  }
}

const MessageCard = ({ chat }: MessageCardProps) => {
  const { user } = useAuth()

  const isQuestion = (chatUserId: string) => {
    return chatUserId === user?.id
  }

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('متن مورد نظر کپی شد.')
    } catch (error) {
      toast.error('بار دیگر کپی کنید.')
    }
  }

  return (
    <div className={`flex gap-2 ${isQuestion(chat.userId) ? '' : 'flex-row-reverse'}`}>
      <div className="size-10 min-h-10 min-w-10 rounded-full">
        <img
          alt={'avatar'}
          className="rounded-full"
          src={isQuestion(chat.userId) ? fileAddress(user?.imageId) : '/images/placeholders/portrait.webp'}
        />
      </div>
      <div
        className={`flex flex-col gap-2 px-4 py-3 rounded-lg border ${isQuestion(chat.userId) ? 'bg-white border-background-50' : 'bg-background-50 border-background-70'}`}
      >
        <p className={`text-sm ${isQuestion(chat.userId) ? '' : 'text-text-dark'}`}>{chat?.message}</p>
        <div className="flex items-center justify-between text-text-light">
          <p className="text-xs">{convertToDateString(chat?.sentAt)}</p>
          <div className="flex items-center mr-2">
            <Button
              iconOnly
              color="default"
              size="sm"
              variant="light"
              onClick={() => copyText(chat?.message)}
            >
              <CopyIcon className="text-text-light size-4" />
            </Button>
            {/* <Button
                          iconOnly
                          variant="light"
                          size="sm"
                          color="default"
                        >
                          <TrashIcon className="text-text-light size-4" />
                        </Button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageCard

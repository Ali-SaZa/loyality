'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { use, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import Button from '@/components/formElements/Button'
import Input from '@/components/formElements/Input'
import PaperPlaneIcon from '@/components/icons/PaperPlaneIcon'
import MessageCard from '@/components/card/MessageCard'
import useGlobal from '@/hooks/useGlobal'
import useLoading from '@/hooks/useLoading'
import { GET_USER_SIMULATION_BY_ID, SEND_CHAT_MESSAGE_WITH_EVALUATOR } from '@/services/simulationUser'
import { TalkFormValidation } from '@/validation/talk'

const TalkDefaultValues = {
  message: '',
}

interface ChatType {
  userId: string
  message: string
  sentAt: string

  [key: string]: string
}

const Talk = ({ params: promisedParams }: PropsWithParams) => {
  const params = use(promisedParams)
  const { data } = useGlobal()
  const { setLoading } = useLoading()

  const [chats, setChats] = useState<ChatType[]>([])
  const talkForm = useForm<z.infer<typeof TalkFormValidation>>({
    resolver: zodResolver(TalkFormValidation),
    defaultValues: {
      ...TalkDefaultValues,
    },
  })

  const getSimulatorDetail = async () => {
    setLoading(true)
    const response = await GET_USER_SIMULATION_BY_ID(params.id)

    setChats(response?.data?.evaluation?.chat)
    setLoading(false)
  }

  const sendMessage = async (data: z.infer<typeof TalkFormValidation>) => {
    try {
      setLoading(true)
      await SEND_CHAT_MESSAGE_WITH_EVALUATOR(params.id, { message: data.message })
      toast.success('پیام شما با موفقیت ارسال شد.')
      await getSimulatorDetail()
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSimulatorDetail()
  }, [])

  return (
    <section className="w-full">
      <div className="flex flex-col gap-6 md:gap-16 md:p-16">
        <div className="flex flex-col gap-6 items-center text-center">
          <h1 className="font-bold text-2xl md:text-4xl md:leading-[56px] text-text-dark">
            گفتگو با ارزیاب <span className="text-primary">{data.navbar.title}</span>
          </h1>
          <p className="text-lg md:text-xl leading-7 md:leading-5">
            {chats && chats.length
              ? chats.length === 2
                ? ' شما پاسخی از ارزیاب دریافت کرده اید ، از صبر شما سپاسگزاریم'
                : 'ارزیاب شما در اسرع وقت پاسخ شما را خواهد داد'
              : 'شما فقط میتوانید یک سوال از ارزیاب بپرسید و ارزیاب شما در اسرع وقت پاسخ شمارا خواهد داد'}
          </p>
        </div>

        <div className="bg-white rounded-xl md:rounded-3xl px-5 md:px-12 py-6 md:py-9">
          {chats && chats.length ? (
            <div className="flex flex-col gap-6">
              {chats.map((chat, index) => (
                <MessageCard
                  key={index}
                  chat={chat}
                />
              ))}
            </div>
          ) : (
            <FormProvider {...talkForm}>
              <form
                className="flex flex-col gap-4 md:gap-6"
                onSubmit={talkForm.handleSubmit(sendMessage)}
              >
                <Input
                  required
                  generalType="textarea"
                  name="message"
                  placeholder="سوال خود را بپرسید"
                />
                <div className="w-full md:w-fit">
                  <Button
                    iconStart={<PaperPlaneIcon className="size-6 text-white" />}
                    type="submit"
                  >
                    ارسال به ارزیاب
                  </Button>
                </div>
              </form>
            </FormProvider>
          )}
        </div>
      </div>
    </section>
  )
}

export default Talk

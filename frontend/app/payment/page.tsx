'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Button from '@/components/formElements/Button'
import useGlobal from '@/hooks/useGlobal'
import BlueGradientAlert from '@/components/ui/BlueGradientAlert'
import DetailWithBorderCard from '@/components/card/DetailWithBorderCard'
import { GET_EVALUATION_DETAIL_FOR_PAYMENT, START_EVALUATION_BANK_PAYMENT } from '@/services/simulationUser'
import useLoading from '@/hooks/useLoading'
import Loading from '@/components/layouts/Loading'
import { EvaluationDetailType, PaymentDetailType } from '@/types'

const Payment = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setData } = useGlobal()
  const { setLoading } = useLoading()

  const [paymentDetail, setPaymentDetail] = useState<PaymentDetailType[]>([])
  const [jobSimulationUserId, setJobSimulationUserId] = useState<string | null>(
    searchParams.has('jobSimulationUserId') ? searchParams.get('jobSimulationUserId') : ''
  )
  const [evaluationDetail, setEvaluationDetail] = useState<EvaluationDetailType>({
    jobSimulationTitle: '',
    cost: 0,
  })

  const fetchEvaluationDetail = async () => {
    try {
      setLoading(true)
      const response = await GET_EVALUATION_DETAIL_FOR_PAYMENT(jobSimulationUserId!)

      setPaymentDetail([
        { title: 'تعداد پیام های مجاز به ارزیاب', value: '1 پیام' },
        { title: 'خدمات', value: 'سنجش مهارت های شما و دریافت مدرک کارآموزی' },
        { title: 'شبیه ساز', value: response.data.jobSimulationTitle },
        { title: 'هزینه پرداختی', value: `${(response.data.cost / 10).toLocaleString()} تومان` },
      ])
      setEvaluationDetail(response.data)
    } catch (error) {
      console.error('error', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartEvaluationBankPayment = async () => {
    try {
      setLoading(true)
      const response = await START_EVALUATION_BANK_PAYMENT(jobSimulationUserId!)

      if (response?.data?.paymentUrl) {
        router.push(response.data.paymentUrl)
      }
    } catch (error) {
      console.error('error', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setData('navbar', { title: 'پرداخت' })
  }, [])

  useEffect(() => {
    if (jobSimulationUserId) {
      fetchEvaluationDetail()
    } else {
      return router.replace('/user')
    }
  }, [jobSimulationUserId])

  return (
    <section className="w-full flex flex-col gap-10">
      <BlueGradientAlert text="بعد از این که پرداخت کردین، کمی صبر کنین تا فرآیند ارزیابی انجام بشه و بازخورد لازم رو دریافت کنین." />
      <DetailWithBorderCard details={paymentDetail} />
      <div className="flex items-center justify-center gap-10">
        <Button
          size="lg"
          variant="bordered"
          onClick={() => router.back()}
        >
          بازگشت به شبیه ساز
        </Button>
        <Button
          className="grow md:grow-0"
          size="lg"
          onClick={handleStartEvaluationBankPayment}
        >
          پرداخت هزینه
        </Button>
      </div>
    </section>
  )
}

const PaymentWrapper = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Payment />
    </Suspense>
  )
}

export default PaymentWrapper

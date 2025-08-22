'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import DetailWithBorderCard from '@/components/card/DetailWithBorderCard'
import Button from '@/components/formElements/Button'
import CheckBoxIcon from '@/components/icons/CheckBoxIcon'
import useGlobal from '@/hooks/useGlobal'
import Loading from '@/components/layouts/Loading'
import CloseCircleIcon from '@/components/icons/CloseCircleIcon'
import { convertToDateString, getFullName, getTimeFromDateString } from '@/helpers'
import useAuth from '@/hooks/useAuth'
import { GET_EVALUATION_DETAIL_FOR_PAYMENT, START_EVALUATION_BANK_PAYMENT } from '@/services/simulationUser'
import useLoading from '@/hooks/useLoading'

const SuccessPayment = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setLoading } = useLoading()
  const { setData } = useGlobal()
  const { user } = useAuth()

  const [evaluationDetail, setEvaluationDetail] = useState<EvaluationDetailType>({
    jobSimulationTitle: '',
    cost: 0,
  })

  const [paymentDetail, setPaymentDetail] = useState<PaymentDetailType[]>([])
  const [status, setStatus] = useState<string | null>(searchParams.has('status') ? searchParams.get('status') : '') // success | fail
  const [payAt, setPayAt] = useState<string | null>(searchParams.has('pay_at') ? searchParams.get('pay_at') : '')
  const [jobSimulationUserId, setJobSimulationUserId] = useState<string | null>(
    searchParams.has('job_simulation_user_id') ? searchParams.get('job_simulation_user_id') : ''
  )
  const [obsTrackingCode, setObsTrackingCode] = useState<string | null>(
    searchParams.has('obs_tracking_code') ? searchParams.get('obs_tracking_code') : ''
  )
  const [bankTrackingCode, setBankTrackingCode] = useState<string | null>(
    searchParams.has('bank_tracking_code') ? searchParams.get('bank_tracking_code') : ''
  )

  const fetchEvaluationDetail = async () => {
    try {
      setLoading(true)
      const response = await GET_EVALUATION_DETAIL_FOR_PAYMENT(jobSimulationUserId!)

      setPaymentDetail([
        {
          title: 'نام و نام خانوادگی پرداخت کننده',
          value: getFullName(user?.firstName, user?.lastName),
        },
        { title: 'شبیه ساز', value: response.data.jobSimulationTitle },
        { title: 'کد پیگیری بانکی', value: bankTrackingCode || 'بدون کد' },
        { title: 'کد پیگیری سایت', value: obsTrackingCode! },
        { title: 'تاریخ پرداخت', value: convertToDateString(payAt!) },
        {
          title: 'زمان پرداخت',
          value: `${getTimeFromDateString(payAt!).hour}:${getTimeFromDateString(payAt!).minute}`,
        },
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
    if (user) {
      fetchEvaluationDetail()
    }
  }, [user])

  useEffect(() => {
    setData('navbar', { title: 'رسید رزرو ارزیاب' })
  }, [])

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="bg-background-50 rounded-full size-[168px] min-w-[168px] min-h-[168px] flex items-center justify-center">
          {status === 'success' ? (
            <CheckBoxIcon className="text-success size-[80px]" />
          ) : (
            <CloseCircleIcon className="text-error size-[80px]" />
          )}
        </div>
        <div className="flex flex-col gap-4 text-center">
          {status === 'success' ? (
            <p className="text-text-dark">
              پرداخت شما با <span className="text-success">موفقیت</span> انجام شد
            </p>
          ) : (
            <p className="text-text-dark">
              پرداخت شما <span className="text-error">ناموفق</span> بود
            </p>
          )}
          <p className={`${status === 'success' ? 'text-success' : 'text-error'} font-bold text-lg`}>
            هزینه پرداختی: {(evaluationDetail?.cost / 10)?.toLocaleString()} تومان
          </p>
        </div>
      </div>
      <DetailWithBorderCard details={paymentDetail} />
      <div className="flex items-center justify-center gap-10">
        {status !== 'success' && (
          <Button
            className="grow md:grow-0"
            size="lg"
            onClick={handleStartEvaluationBankPayment}
          >
            پرداخت مجدد
          </Button>
        )}
        <Button
          className={status === 'success' ? 'grow md:grow-0' : ''}
          size="lg"
          variant={status === 'success' ? 'solid' : 'bordered'}
          onClick={() => router.replace(`/user/simulators/${jobSimulationUserId}`)}
        >
          {status === 'success' ? 'تایید و ادامه' : 'بازگشت به شبیه ساز'}
        </Button>
      </div>
    </section>
  )
}

const SuccessPaymentWrapper = () => {
  return (
    <Suspense fallback={<Loading />}>
      <SuccessPayment />
    </Suspense>
  )
}

export default SuccessPaymentWrapper

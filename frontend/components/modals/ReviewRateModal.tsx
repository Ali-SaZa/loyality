'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useDisclosure } from '@nextui-org/modal'
import { CircularProgress } from '@nextui-org/progress'
import toast from 'react-hot-toast'
import { Rating } from '@smastrom/react-rating'

import Modal from '@/components/modals/Modal'
import { GET_ALL_REVIEW_QUESTIONS } from '@/services/simulations'
import Button from '@/components/formElements/Button'
import { SAVE_USER_REVIEW_FOR_SIMULATION } from '@/services/simulationUser'

import '@smastrom/react-rating/style.css'

interface SimulatorSortModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  jobSimulationUserId: string
}

const ReviewRateModal = ({ isOpen, setIsOpen, jobSimulationUserId }: SimulatorSortModalProps) => {
  const { onOpenChange } = useDisclosure()

  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState<{ id: string; question: string }[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [rate, setRate] = useState(0)
  const [reviews, setReviews] = useState<{ reviewQuestionId: string; level: number }[]>([])
  const [step, setStep] = useState(1)

  const fetchAllReviewQuestions = async () => {
    try {
      setIsLoading(true)
      const response = await GET_ALL_REVIEW_QUESTIONS()

      setQuestions(response?.data?.questions)
    } catch (error) {
      console.log('error', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchAllReviewQuestions()
    }
  }, [isOpen])

  const activeQuestion = useMemo(() => {
    return questions?.length > 0 ? questions[currentQuestionIndex] : null
  }, [currentQuestionIndex, questions])

  const nextButtonDetail = () => {
    if (step === 2) {
      return {
        name: 'دریافت گواهینامه',
        disabled: rate === 0,
        action: async () => {
          try {
            setIsLoading(true)

            await SAVE_USER_REVIEW_FOR_SIMULATION({ jobSimulationUserId, rate, reviews })

            toast.success('امتیازات شما با موفقیت ثبت شد.')
            setIsOpen(false)
            setCurrentQuestionIndex(0)
            setReviews([])
            setRate(0)
            setStep(1)
          } catch (error) {
            console.log('error', error)
          } finally {
            setIsLoading(false)
          }
        },
      }
    } else {
      return {
        name: 'بعدی',
        disabled: !reviews.some((r) => r.reviewQuestionId === activeQuestion?.id),
        action: () => {
          if (currentQuestionIndex < questions?.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
          } else {
            setStep(2)
          }
        },
      }
    }
  }

  const prevButtonDetail = () => {
    if (step === 2) {
      return {
        name: 'قبلی',
        action: () => {
          setStep(1)
        },
      }
    } else {
      return {
        name: 'قبلی',
        action: () => {
          setCurrentQuestionIndex(currentQuestionIndex - 1)
        },
      }
    }
  }

  const HandleClickOnReviewLevelButton = (level: number) => {
    const reviewQuestionId = questions[currentQuestionIndex]?.id
    const hasReviewed = reviews.some((r) => r.reviewQuestionId === reviewQuestionId)

    if (hasReviewed) {
      const updatedReview = reviews.map((r) => (r.reviewQuestionId === reviewQuestionId ? { ...r, level } : r))

      setReviews(updatedReview)
    } else {
      setReviews((prev) => [...prev, { reviewQuestionId, level }])
    }
  }

  const isLevelActive = (level: number) => {
    return reviews.find((r) => r.reviewQuestionId === activeQuestion?.id)?.level === level
  }

  return (
    <Modal
      hideFooter
      acceptBtnText="ارسال"
      headerClassName="border-none font-semibold"
      isLoading={isLoading}
      isOpen={isOpen}
      size="2xl"
      title="قبل از اینکه گواهینامه خود را دریافت کنید، چند سوال نهایی از  شما داریم!"
      onClose={() => setIsOpen(false)}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col gap-6">
        {step === 1 ? (
          <>
            <div className="flex items-center gap-2">
              <CircularProgress
                aria-label="progress"
                color="primary"
                maxValue={questions?.length}
                minValue={1}
                size="md"
                value={currentQuestionIndex + 1}
              />

              <p>
                سوال {currentQuestionIndex + 1} از {questions?.length}
              </p>
            </div>
            <p>{activeQuestion?.question}</p>
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                color="secondary"
                variant={isLevelActive(5) ? 'solid' : 'bordered'}
                onClick={() => HandleClickOnReviewLevelButton(5)}
              >
                کاملا موافقم
              </Button>
              <Button
                color="secondary"
                variant={isLevelActive(4) ? 'solid' : 'bordered'}
                onClick={() => HandleClickOnReviewLevelButton(4)}
              >
                موافق
              </Button>
              <Button
                color="secondary"
                variant={isLevelActive(3) ? 'solid' : 'bordered'}
                onClick={() => HandleClickOnReviewLevelButton(3)}
              >
                نظری ندارم
              </Button>
              <Button
                color="secondary"
                variant={isLevelActive(2) ? 'solid' : 'bordered'}
                onClick={() => HandleClickOnReviewLevelButton(2)}
              >
                مخالف
              </Button>
              <Button
                color="secondary"
                variant={isLevelActive(1) ? 'solid' : 'bordered'}
                onClick={() => HandleClickOnReviewLevelButton(1)}
              >
                به شدت مخالف
              </Button>
            </div>
          </>
        ) : (
          <>
            <p>تجربه برنامه خود را چگونه ارزیابی می کنید؟</p>
            <div
              className="flex justify-center"
              dir="ltr"
            >
              <Rating
                style={{ maxWidth: 180 }}
                value={rate}
                onChange={(value: number) => setRate(value)}
              />
            </div>
          </>
        )}
        <div className="flex items-center justify-end gap-4 pt-6 ">
          {currentQuestionIndex !== 0 && (
            <Button
              isLoading={isLoading}
              variant="bordered"
              onClick={() => prevButtonDetail().action()}
            >
              {prevButtonDetail().name}
            </Button>
          )}
          <Button
            className="w-full md:w-fit"
            disabled={nextButtonDetail().disabled}
            isLoading={isLoading}
            onClick={() => nextButtonDetail().action()}
          >
            {nextButtonDetail().name}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ReviewRateModal

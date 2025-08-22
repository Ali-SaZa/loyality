'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { Progress } from '@nextui-org/progress'
import { RadioGroup } from '@nextui-org/radio'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import Radio from '@/components/formElements/Radio'
import useLoading from '@/hooks/useLoading'
import Alert from '@/components/utils/Alert'
import { GET_SIMULATION_QUIZ } from '@/services/simulations'
import Button from '@/components/formElements/Button'
import { COMPLETE_QUIZ } from '@/services/simulationUser'

interface QuizProps {
  jobSimulationId: string
  jobSimulationUser: any
}

type OptionType = { text: string; isCorrect: boolean }

const Quiz = ({ jobSimulationId, jobSimulationUser }: QuizProps) => {
  const router = useRouter()
  const { setLoading } = useLoading()
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [questions, setQuestions] = useState<any[]>([])
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [options, setOptions] = useState<OptionType[]>([])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await GET_SIMULATION_QUIZ(jobSimulationId)

      setQuestions(response?.data?.questions)
      setActiveQuestionIndex(0)
      setSelectedAnswer('')
      setOptions([])
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const activeQuestion = useMemo(() => {
    return questions[activeQuestionIndex]
  }, [activeQuestionIndex, questions])

  const isCorrectAnswerClicked = useMemo(() => {
    return selectedAnswer.includes('true')
  }, [selectedAnswer])

  const isLastQuestion = useMemo(() => {
    return questions?.length === activeQuestionIndex + 1
  }, [activeQuestionIndex, questions])

  useEffect(() => {
    if (activeQuestion) {
      // بررسی اینکه آیا incorrectAnswers یک آرایه است یا خیر
      const incorrectAnswers = Array.isArray(activeQuestion.incorrectAnswers) ? activeQuestion.incorrectAnswers : [] // اگر incorrectAnswers غیر آرایه باشد، آرایه خالی می‌گذاریم.
      // ترکیب correctAnswer و incorrectAnswers در یک آرایه
      let options = [
        { text: activeQuestion.correctAnswer, isCorrect: true },
        ...incorrectAnswers.map((answer: string) => ({ text: answer, isCorrect: false })),
      ]

      // Fisher-Yates Shuffle برای مرتب‌سازی تصادفی
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))

        ;[options[i], options[j]] = [options[j], options[i]] // تغییر مکان دو عنصر
      }
      // به روز رسانی state
      setOptions(options)
    }
  }, [activeQuestionIndex, activeQuestion])

  const nextButtonHandler = useMemo(() => {
    if (isLastQuestion) {
      return {
        text: 'پایان آزمون',
        action: async () => {
          try {
            setLoading(true)
            await COMPLETE_QUIZ(jobSimulationUser?.id)
            toast.success('تبریک! ماموریت نهایی تکمیل شد.')

            return router.replace(`/user/simulators/${jobSimulationUser?.id}`)
          } catch (error) {
            console.log('error', error)
          } finally {
            setLoading(false)
          }
        },
      }
    } else {
      return {
        text: 'بعدی',
        action: () => {
          setActiveQuestionIndex(activeQuestionIndex + 1)
          setSelectedAnswer('')
        },
      }
    }
  }, [isLastQuestion, activeQuestionIndex])

  return (
    <div className="flex flex-col py-2.5 px-4 gap-5 md:w-[80%]">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Progress
            aria-label="progress"
            className="rotate-180"
            value={((activeQuestionIndex + 1) / questions?.length) * 100}
          />
          <p className="text-sm">
            سوال {activeQuestionIndex + 1} از {questions?.length}
          </p>
        </div>
        <p className="text-text-dark font-bold text-medium leading-6 md:text-lg md:leading-7">{activeQuestion?.title}</p>
      </div>
      <RadioGroup
        isDisabled={isCorrectAnswerClicked}
        value={selectedAnswer}
        onValueChange={setSelectedAnswer}
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
          {options?.map((option, index) => (
            <Radio
              key={index}
              value={option.text + index + option.isCorrect}
            >
              {option.text}
            </Radio>
          ))}
        </div>
      </RadioGroup>
      {selectedAnswer &&
        (isCorrectAnswerClicked ? (
          <Alert
            color="success"
            title={activeQuestion?.correctAnswerDescription}
          />
        ) : (
          <Alert
            color="danger"
            title={activeQuestion?.incorrectAnswerDescription}
          />
        ))}
      <div className="mx-auto mt-10">
        <Button
          disabled={!isCorrectAnswerClicked}
          size={'lg'}
          onClick={nextButtonHandler?.action}
        >
          {nextButtonHandler?.text}
        </Button>
      </div>
    </div>
  )
}

export default Quiz

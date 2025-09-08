'use client'

import { useEffect } from 'react'

import Button from '@/components/formElements/Button'

export default function GlobalError({ error }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error)
  }, [error])

  return (
    <div className="w-full h-[100dvh] flex flex-col justify-center items-center">
      <h2 className="font-bold text-xl mb-4">مشکلی رخ داده است</h2>
      <Button to={'/'}>بازگشت به خانه</Button>
    </div>
  )
}

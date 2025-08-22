import React from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'

const CountdownTimer = ({ time = 120000, onComplete }: { time?: number; onComplete: () => void }) => {
  // تابع رندر برای نمایش دقیقه و ثانیه
  const renderer = ({ minutes, seconds }: CountdownRenderProps) => {
    return (
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    )
  }

  return (
    // شمارش معکوس به مدت ۲ دقیقه (120000 میلی‌ثانیه)
    <Countdown
      date={Date.now() + time}
      renderer={renderer}
      onComplete={onComplete}
    />
  )
}

export default CountdownTimer

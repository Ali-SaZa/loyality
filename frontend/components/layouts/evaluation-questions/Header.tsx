import React from 'react'

import Button from '@/components/formElements/Button'

const Header = () => {
  return (
    <header className="w-full flex items-center justify-center container h-screen">
      <div className="flex flex-col-reverse md:flex-row items-center gap-4 md:gap-16">
        <div className="flex flex-col gap-9 flex-1">
          <p className="text-text-dark text-[32px] md:text-5xl text-center md:text-start font-medium md:font-normal">
            میخوای واسه شروع کمکت کنم؟
          </p>
          <p className="text-medium md:text-[20px] leading-6 md:leading-7 text-center md:text-justify">
            میدونی که شبیه ساز شغلی یه تجربه ی ارزشمنده تا بتونی از بین گزینه های مختلف، شغل مناسب خودت رو پیدا کنی. اگه میخوای بدونی کدوم
            شبیه ساز بیشتر مناسب تو هست روی شروع آزمون بزن.
          </p>
          <div className="w-full md:w-fit">
            <Button
              fullWidth
              size="lg"
              to="/start-evaluation-questions"
            >
              شروع آزمون
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <img
            alt="evaluation questions header"
            src="/images/EvaluationQuestionsHeader.webp"
          />
        </div>
      </div>
    </header>
  )
}

export default Header

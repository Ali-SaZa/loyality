import React from 'react'

import HtmlRenderer from '@/components/utils/HtmlRenderer'

interface StartSimulatorStepDescriptionCardProps {
  imgSrc?: string
  title: string
  description: string
  imgComponent?: React.ReactNode
}

const StartSimulatorStepDescriptionCard = ({ imgSrc, title, description, imgComponent }: StartSimulatorStepDescriptionCardProps) => {
  return (
    <div className="rounded-2xl bg-background-10 p-6 flex flex-col lg:flex-row gap-6 ">
      <div className="bg-background-50 rounded-full size-[120px] min-w-[120px] md:size-[194px] md:min-w-[194px] flex items-center justify-center mx-auto md:mx-0">
        {imgComponent || (
          <img
            alt="task 1"
            className="w-[66px] h-[39px] md:w-[132px] md:h-[104px]"
            src={imgSrc}
          />
        )}
      </div>
      <div className="flex flex-col gap-2 md:gap-4">
        <p className="text-text-dark font-bold text-md md:text-lg text-center">{title}</p>
        <HtmlRenderer htmlContent={description || ''} />
      </div>
    </div>
  )
}

export default StartSimulatorStepDescriptionCard

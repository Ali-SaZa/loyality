import React from 'react'

import StartSimulatorStepDescriptionCard from '@/components/card/StartSimulatorStepDescriptionCard'
import VideoPlayer from '@/components/media/VideoPlayer'

interface StepFiveProps {
  summary: {
    description: string
    videoId: string
    videoTitle: string
    videoDescription: string
  }
}

const StepFive = ({ summary }: StepFiveProps) => {
  return (
    <div className="flex flex-col gap-4 md:gap-7 lg:w-[80%]">
      <StartSimulatorStepDescriptionCard
        description={summary?.description}
        imgSrc="/images/task4.png"
        title="جمع بندی و بازخورد"
      />
      {!!summary?.videoId && (
        <div className="bg-background-20 rounded-xl py-6 px-8 flex flex-col gap-2 md:gap-4">
          <VideoPlayer videoId={summary?.videoId} />
          <p className="text-text-dark text-md md:text-xl font-medium text-center">{summary?.videoTitle}</p>
          <p className="text-justify text-text-light-25 text-sm md:text-medium">{summary?.videoDescription}</p>
        </div>
      )}
    </div>
  )
}

export default StepFive

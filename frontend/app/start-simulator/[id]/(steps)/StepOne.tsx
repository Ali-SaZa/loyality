import React from 'react'

import StartSimulatorStepDescriptionCard from '@/components/card/StartSimulatorStepDescriptionCard'
import VideoPlayer from '@/components/media/VideoPlayer'

interface StepOneProps {
  introduction: {
    description: string
    videoId: string
    videoTitle: string
    videoDescription: string
  }
}

const StepOne = ({ introduction }: StepOneProps) => {
  return (
    <div className="flex flex-col gap-4 md:gap-7 lg:w-[80%]">
      <StartSimulatorStepDescriptionCard
        description={introduction?.description}
        imgSrc="/images/task1.png"
        title="آنچه در این گام خواهید آموخت"
      />
      {!!introduction?.videoId && (
        <div className="bg-background-20 rounded-xl py-6 px-8 flex flex-col gap-2 md:gap-4">
          <VideoPlayer videoId={introduction?.videoId} />
          <p className="text-text-dark text-md md:text-xl font-medium text-center">{introduction?.videoTitle}</p>
          <p className="text-justify text-text-light-25 text-sm md:text-medium">{introduction?.videoDescription}</p>
        </div>
      )}
    </div>
  )
}

export default StepOne

import React from 'react'

import StartSimulatorStepDescriptionCard from '@/components/card/StartSimulatorStepDescriptionCard'
import CheckBoxIcon from '@/components/icons/CheckBoxIcon'
import EpsIcon from '@/components/icons/EpsIcon'
import Button from '@/components/formElements/Button'
import { handleDownload } from '@/helpers'

interface StepFourProps {
  correctFile: {
    description: string
    title: string
    fileId: string
  }
}

const StepFour = ({ correctFile }: StepFourProps) => {
  return (
    <div className="flex flex-col gap-4 md:gap-7 lg:w-[80%]">
      <StartSimulatorStepDescriptionCard
        description={correctFile?.description}
        imgComponent={<CheckBoxIcon className="text-success size-[47px] md:size-[90px]" />}
        title="اتمام وظیفه"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="border border-background-50 rounded-2xl flex md:flex-col items-center gap-3 md:gap-6 p-3 md:p-6">
          <div className="md:mx-auto rounded-full size-[56px] !min-w-[56px] md:size-[100px] md:!min-w-[100px] flex items-center justify-center bg-[#F2FFFB]">
            <EpsIcon className="size-6 md:size-[38px] text-success" />
          </div>
          <div className="flex flex-col grow md:w-full gap-3 md:gap-6">
            <p className="text-text-dark md:text-center font-bold md:font-normal text-sm md:text-medium">{correctFile?.title || ''}</p>
            <Button
              fullWidth
              color="secondary"
              onClick={() => handleDownload(correctFile?.fileId, correctFile?.title)}
            >
              دانلود
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StepFour

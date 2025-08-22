import React from 'react'

import StartSimulatorStepDescriptionCard from '@/components/card/StartSimulatorStepDescriptionCard'
import DynamicIcon from '@/components/utils/DynamicIcon'
import Button from '@/components/formElements/Button'
import { handleDownload } from '@/helpers'
import FileUpload from '@/components/media/FileUpload'

interface StepThreeProps {
  userFile: {
    description: string
    validFileType: string
    templateFileId: string
    videoDescription: string
  }
  currentTaskIndex: number
  uploadedFileId: string
  setUploadedFileId: (fileId: string) => void
  userFileId: string
  currentTaskHasFileId: boolean
}

const StepThree = ({ userFile, currentTaskIndex, uploadedFileId, setUploadedFileId, userFileId, currentTaskHasFileId }: StepThreeProps) => {
  const handleFileUploaded = async (fileId: string, mode: 'save' | 'remove' = 'save') => {
    if (mode === 'remove') {
      setUploadedFileId('')
    } else {
      setUploadedFileId(fileId)
    }
  }

  return (
    <div className="flex flex-col gap-4 md:gap-7 lg:w-[80%]">
      <StartSimulatorStepDescriptionCard
        description={userFile?.description}
        imgSrc="/images/task3.png"
        title="فایل های تمپلیت"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="border border-background-50 rounded-2xl flex md:flex-col items-center gap-3 md:gap-6 p-3 md:p-6">
          <div className="rounded-full size-[56px] !min-w-[56px] md:size-[100px] md:!min-w-[100px] flex items-center justify-center bg-[#F2FFFB]">
            <DynamicIcon
              className="size-6 md:size-[38px] text-success"
              iconType={userFile?.validFileType}
            />
          </div>
          <div className="flex flex-col grow md:w-full gap-3 md:gap-6">
            <p className="text-text-dark md:text-center font-bold md:font-normal text-sm md:text-medium">
              تمپلیت ماموریت {currentTaskIndex + 1}
            </p>
            <Button
              fullWidth
              color="secondary"
              onClick={() => handleDownload(userFile?.templateFileId, `taskTemplate ${currentTaskIndex + 1}`)}
            >
              دانلود
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <p className="font-bold text-text-dark text-medium md:text-lg">لطفا فایل انجام شده‌ی وظایف خود را ارسال کنید.</p>
        <div className="grid grid-cols-1 md:grid-cols-1">
          <div className={`${!uploadedFileId && 'col-span-3'}`}>
            <FileUpload
              accept={[userFile?.validFileType]}
              buttonText="انتخاب فایل"
              fileId={userFileId}
              fileUploaded={handleFileUploaded}
              noInteraction={currentTaskHasFileId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StepThree

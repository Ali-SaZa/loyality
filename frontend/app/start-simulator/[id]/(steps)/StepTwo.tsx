import React, { useEffect, useState } from 'react'

import StartSimulatorStepDescriptionCard from '@/components/card/StartSimulatorStepDescriptionCard'
import { fileAddress, getMediaType, handleDownload } from '@/helpers'
import AudioPlayer from '@/components/media/AudioPlayer'
import DynamicIcon from '@/components/utils/DynamicIcon'
import Button from '@/components/formElements/Button'
import FilePreviewModal from '@/components/modals/FilePreviewModal'

type externalLearningSourceType = { title: string; link: string; target: string }
type internalLearningSourceType = { title: string; learningFileId: string; learningFileType: string; target: string }

interface StepTwoProps {
  taskIntroduction: {
    description: string
    externalLearningSource: externalLearningSourceType[]
    internalLearningSource: internalLearningSourceType[]
  }
}

const StepTwo = ({ taskIntroduction }: StepTwoProps) => {
  const [isOpenFilePreviewModal, setIsOpenFilePreviewModal] = useState(false)
  const [sourceFileId, setSourceFileId] = useState('')
  const [sourceFileType, setSourceFileType] = useState<string>()
  const [sourceFileName, setSourceFileName] = useState('name')

  useEffect(() => {
    if (sourceFileId !== '') {
      setIsOpenFilePreviewModal(true)
    }
  }, [sourceFileId])

  useEffect(() => {
    if (!isOpenFilePreviewModal) {
      setSourceFileId('')
      setSourceFileType('')
      setSourceFileName('')
    }
  }, [isOpenFilePreviewModal])

  return (
    <>
      <div className="flex flex-col gap-4 md:gap-7 lg:w-[80%]">
        <StartSimulatorStepDescriptionCard
          description={taskIntroduction?.description}
          imgSrc="/images/task2.png"
          title="توضیحات انجام کار"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {taskIntroduction?.externalLearningSource.map((item: externalLearningSourceType, index: number) => (
            <div
              key={index}
              className={`border border-background-50 rounded-2xl flex md:flex-col items-center gap-3 md:gap-6 p-3 md:p-6 ${getMediaType(item.link) === 'Audio' ? 'flex-col' : ''}`}
            >
              {getMediaType(item.link) === 'Audio' && item.target === 'ELST_SELF' ? (
                <div className="flex items-center justify-center w-full my-6">
                  <AudioPlayer
                    audioId={item.link}
                    isUrl={true}
                  />
                </div>
              ) : getMediaType(item.link) === 'Image' && item.target === 'ELST_SELF' ? (
                <div className="md:mx-auto rounded-full size-[56px] !min-w-[56px] md:size-[100px] md:!min-w-[100px] flex items-center justify-center bg-background-primary">
                  <img
                    alt="media content"
                    className="size-[56px] md:size-[100px] rounded-full object-cover"
                    src={item.link}
                  />
                </div>
              ) : (
                <div className="md:mx-auto rounded-full size-[56px] !min-w-[56px] md:size-[100px] md:!min-w-[100px] flex items-center justify-center bg-background-primary">
                  <DynamicIcon
                    className="size-6 md:size-[38px] text-[#7879F1]"
                    iconType={'link'}
                  />
                </div>
              )}
              <div className="flex flex-col grow w-full gap-3 md:gap-6">
                <p
                  className={`text-text-dark md:text-center font-bold md:font-normal text-sm md:text-medium ${getMediaType(item.link) === 'Audio' ? 'text-center' : ''}`}
                >
                  {item.title}
                </p>
                <Button
                  fullWidth
                  color="secondary"
                  target="_blank"
                  to={item.target !== 'ELST_SELF' ? item.link : ''}
                  onClick={() => {
                    if (item.target === 'ELST_SELF') {
                      const mediaType = getMediaType(item.link)

                      if (mediaType === 'Image' || mediaType === 'Video') {
                        setSourceFileId(item.link)
                        setSourceFileName(item.title)
                      } else if (mediaType === 'Audio') {
                        handleDownload(item.link, item.title, true)
                      }
                    }
                  }}
                >
                  {getMediaType(item.link) === 'Audio' ? 'دانلود' : ' نمایش انجام کار'}
                </Button>
              </div>
            </div>
          ))}
          {taskIntroduction?.internalLearningSource.map((item: internalLearningSourceType, index: number) => (
            <div
              key={index}
              className={`border border-background-50 rounded-2xl flex md:flex-col items-center gap-3 md:gap-6 p-3 md:p-6 ${item.learningFileType === 'UFFT_Audio' ? 'flex-col' : ''}`}
            >
              {item.learningFileType === 'UFFT_Audio' ? (
                <div className="flex items-center justify-center w-full my-6">
                  <AudioPlayer audioId={item.learningFileId} />
                </div>
              ) : item.learningFileType === 'UFFT_Image' ? (
                <div className="md:mx-auto rounded-full size-[56px] !min-w-[56px] md:size-[100px] md:!min-w-[100px] flex items-center justify-center bg-background-primary">
                  <img
                    alt="media content"
                    className="size-[56px] md:size-[100px] rounded-full object-cover"
                    src={fileAddress(item?.learningFileId)}
                  />
                </div>
              ) : (
                <div className="md:mx-auto rounded-full size-[56px] !min-w-[56px] md:size-[100px] md:!min-w-[100px] flex items-center justify-center bg-background-primary">
                  <DynamicIcon
                    className="size-6 md:size-[38px] text-[#7879F1]"
                    iconType={item?.learningFileType}
                  />
                </div>
              )}
              <div className="flex flex-col grow w-full gap-3 md:gap-6">
                <p
                  className={`text-text-dark md:text-center font-bold md:font-normal text-sm md:text-medium ${item.learningFileType === 'UFFT_Audio' ? 'text-center' : ''}`}
                >
                  {item.title}
                </p>
                <Button
                  fullWidth
                  color="secondary"
                  onClick={() => {
                    if (item.target === 'ILST_DOWNLOAD' || item.learningFileType === 'UFFT_Text') {
                      handleDownload(item.learningFileId, item.title)
                    } else if (item.target === 'ILST_SELF' && item.learningFileType !== 'UFFT_Audio') {
                      setSourceFileId(item.learningFileId)
                      setSourceFileType(item.learningFileType)
                    }
                  }}
                >
                  {item.target === 'ILST_DOWNLOAD' || item.learningFileType === 'UFFT_Text' ? 'دانلود' : 'نمایش انجام کار'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FilePreviewModal
        fileId={sourceFileId}
        fileName={sourceFileName}
        fileType={sourceFileType}
        isOpen={isOpenFilePreviewModal}
        setIsOpen={setIsOpenFilePreviewModal}
      />
    </>
  )
}

export default StepTwo

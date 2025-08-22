import React from 'react'

import { convertToDateString, getFullName } from '@/helpers'

interface ParticipationProps {
  jobSimulationName: string
  organizationName: string
  skills: any[]
  user: any
}

const Participation = ({ jobSimulationName, organizationName, skills, user }: ParticipationProps) => {
  return (
    <div className="relative w-[1123px] h-[794px] ">
      <img
        alt="participation"
        className="absolute w-full h-full z-0"
        src="/certificates/participation.jpg"
      />
      <p className="absolute left-[5%] top-[8%] text-white text-[20px]">{convertToDateString(new Date().toString())}</p>
      <div className="flex flex-col items-center justify-center z-10 absolute center-with-absolute top-[57%] w-[90%]">
        <h1 className="text-[16px] text-center">گواهی می شود:</h1>
        <p className="text-[30px] font-semibold text-center text-primary">
          {user?.sex === 'S_Male' ? 'آقای' : user?.sex === 'S_Female' ? 'خانم' : ''} {getFullName(user?.firstName, user?.lastName)}
        </p>
        <p className="text-[20px] text-center my-10">
          به شماره ملی <span className="font-bold">{user?.nationalCode}</span> در شبیه ساز شغلی{' '}
          <span className="font-bold">{jobSimulationName}</span> شرکت نموده است. این شبیه ساز با هدف بهبود قابلیت های حرفه ای و آمادگی شغلی
          در این حوزه متناسب با فضای کاری <span className="font-bold">{organizationName}</span> طراحی شده است.
        </p>
        <p className="text-[16px] text-center">مهارت هایی که طی این شبیه ساز به آن پرداخته شده است:</p>
        <div className="grid grid-cols-2 w-full gap-x-10 gap-y-2 text-[20px] font-bold mt-4 list-disc list-inside">
          {skills?.map((skill, index) => (
            <div
              key={index}
              className="flex items-start mr-20"
            >
              <span className="marker:text-black">•</span>
              <span className="pr-4">
                مهارت {index + 1}: {skill?.skillTitle}
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="absolute left-[16%] bottom-[10%] text-[16px] text-text-dark">مدیر ارشد شبیه ساز OBS</p>
    </div>
  )
}

export default Participation

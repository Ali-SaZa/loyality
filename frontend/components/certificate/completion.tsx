import React from 'react'

import { getFullName } from '@/helpers'

interface CompletionProps {
  jobSimulationName: string
  organizationName: string
  organizationLogoUrl: string
  skills: any[]
  user: any
}

const Completion = ({ jobSimulationName, organizationName, organizationLogoUrl, skills, user }: CompletionProps) => {
  return (
    <div className="relative w-[794px] h-[1123px] ">
      <img
        alt="completion"
        className="absolute w-full h-full z-0"
        src="/certificates/completion.jpg"
      />
      <div className="absolute left-[7%] top-[9%] max-w-28">
        <img
          alt="organizationLogoId"
          src={organizationLogoUrl}
        />
      </div>
      <div className="flex flex-col items-center justify-center z-10 absolute center-with-absolute top-[50%] w-[90%]">
        <h1 className="text-[20px] text-center ">این گواهی ارائه میگردد به</h1>
        <p className="text-[30px] font-semibold text-center text-primary">
          {user?.sex === 'S_Male' ? 'آقای' : user?.sex === 'S_Female' ? 'خانم' : ''} {getFullName(user?.firstName, user?.lastName)}
        </p>
        <p className="text-[20px] text-center my-10">
          با کد ملی <span className="font-bold">{user?.nationalCode}</span> در شبیه ساز شغلی{' '}
          <span className="font-bold">{jobSimulationName}</span> که با هدف بهبود قابلیت های حرفه ای و آمادگی شغلی در این حوزه متناسب با فضای
          کاری <span className="font-bold">{organizationName}</span> طراحی شده است شرکت نموده است و مهارت های زیر را کسب نموده است:
        </p>
        <p className="text-[20px] text-center font-bold border-b-2 pb-3 border-secondary">دستاورد ها و مهارت ها:</p>
        <div className="w-full flex flex-col text-[20px] mt-4 list-disc list-inside">
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
        <p className="text-center my-10 text-[20px]">
          این دوره به منظور آماده سازی کاراموزان برای ورود به بازار کار و توسعه مهارت های مرتبط با صنعت طراحی شده و تکمیل آن گامی بزرگ در
          مسیر حرفه ای شرکت کننده است.
        </p>
      </div>
      <p className="absolute right-[12%] bottom-[11%] text-[16px] text-text-dark">مدیر ارشد شبیه‌ ساز OBS</p>
      <p className="absolute right-[63%] bottom-[11%] text-[16px] text-text-dark">نام شرکت: {organizationName}</p>
    </div>
  )
}

export default Completion

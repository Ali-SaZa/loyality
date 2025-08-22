import React from 'react'
import { useRouter } from 'next/navigation'

import Hashtag from '../ui/Hashtag'

import { fileAddress } from '@/helpers'

const OrganizationCard = ({ organization }: { organization: any }) => {
  const router = useRouter()

  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-2 bg-background-10 hover:shadow-xl transition-all ease-linear duration-200"
      role="button"
      tabIndex={0}
      onClick={() => {
        if (organization?.id) {
          router.push('/organizations/' + organization?.id)
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && organization?.id) {
          router.push('/organizations/' + organization?.id)
        }
      }}
    >
      <div className="rounded-xl bg-white flex items-center justify-center min-h-[116px] max-h-[116px] overflow-hidden">
        <img
          alt="organization"
          className="rounded-xl"
          src={fileAddress(organization?.thumbnailImageId)}
        />
      </div>
      <div className="p-2 gap-3 flex flex-col h-full">
        <div className="flex flex-col gap-4 grow">
          <div className="flex flex-col gap-2">
            <p className="text-text-dark font-semibold text-lg leading-7">{organization?.organizationName}</p>
            {!!organization?.websiteUrl && (
              <a
                className="cursor-pointer"
                href={organization?.websiteUrl}
                rel="noopener noreferrer"
                target="_blank"
                onClick={(e) => e.stopPropagation()} // جلوگیری از کلیک روی کارت
              >
                {organization?.websiteUrl}
              </a>
            )}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {!!organization?.jobCategories?.length &&
              organization.jobCategories.map((item: string, index: number) => (
                <Hashtag
                  key={index}
                  className="bg-primary text-white"
                  text={item}
                />
              ))}
          </div>
        </div>
        <div className="border-t border-background-50 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary size-1.5 rounded-full" />
            <p className="text-xs text-text-light-25">تاسیس در {organization?.establishmentYear}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primary size-1.5 rounded-full" />
            <p className="text-xs text-text-light-25">{organization?.employeeCount} نفر</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizationCard

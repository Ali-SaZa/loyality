'use client'
import { usePathname } from 'next/navigation'

import Button from '@/components/formElements/Button'
import ObsLogo from '@/components/ui/ObsLogo'
import { siteConfig } from '@/config/site'

import '@/styles/userSidebar.scss'
import React, { useState } from 'react'
import { Tooltip } from '@heroui/tooltip'

import { fileAddress, getFullName } from '@/helpers'
import useAuth from '@/hooks/useAuth'
import UpdateAvatarModal from '@/components/modals/UpdateAvatarModal'

const Sidebar = () => {
  const pathname = usePathname()
  const { user } = useAuth()

  const [isOpenUpdateAvatarModal, setIsOpenUpdateAvatarModal] = useState(false)

  const isActive = (link: string) => {
    if (pathname === link) return true
    else return pathname.includes(link.split('/')[2])
  }

  return (
    <div className="sidebar bg-white hidden md:flex flex-col h-[100dvh] min-w-[230px] fixed right-0 z-50">
      <div className="py-2 px-8 flex items-center justify-center border-b">
        <ObsLogo iconSize={155} />
      </div>
      <div className="py-3 flex flex-col justify-between h-full overflow-auto">
        <div className="flex flex-col gap-2 items-center justify-center">
          {siteConfig.userSidebar.map((item: any, index) => (
            <div
              key={index}
              className={`px-4 w-full relative ${isActive(item.link) && 'sidebar-links-active'}`}
            >
              <Button
                fullWidth
                className="justify-start"
                disabled={item.disable}
                iconStart={item.icon(`size-6 ${isActive(item.link) ? 'text-text-dark' : 'text-text-light-25'}`)}
                size="lg"
                target={item?.target ? item?.target : '_self'}
                to={item.link}
                variant={isActive(item.link) ? 'flat' : 'light'}
              >
                <p className={`text-sm ${isActive(item.link) ? 'text-text-dark' : 'text-text-light-25'} leading-4 font-normal`}>
                  {item.title}
                </p>
              </Button>
            </div>
          ))}
        </div>
        <div className="py-6 px-4 rounded-lg bg-white flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-3 items-center">
            <Tooltip content="برای تغییر آواتار کلیک کنید">
              <div
                role="button"
                onClick={() => setIsOpenUpdateAvatarModal(true)}
              >
                <img
                  alt="user profile"
                  className="rounded-full mx-auto size-[100px]"
                  height={100}
                  src={
                    user?.imageId
                      ? fileAddress(user?.imageId)
                      : user?.sex === 'S_Male'
                        ? '/images/placeholders/man-placeholder.webp'
                        : user?.sex === 'S_Female'
                          ? '/images/placeholders/woman-placeholder.webp'
                          : '/images/placeholders/portrait.webp'
                  }
                  width={100}
                />
              </div>
            </Tooltip>
            <div className="flex flex-col gap-2">
              <p className="font-medium text-base leading-6">{getFullName(user?.firstName, user?.lastName)}</p>
            </div>
          </div>
          <Button
            fullWidth
            to="/auth/profile"
          >
            ویرایش اطلاعات
          </Button>
        </div>
      </div>
      <UpdateAvatarModal
        isOpen={isOpenUpdateAvatarModal}
        setIsOpen={setIsOpenUpdateAvatarModal}
      />
    </div>
  )
}

export default Sidebar

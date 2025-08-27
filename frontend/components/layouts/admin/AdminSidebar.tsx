'use client'
import { usePathname } from 'next/navigation'
import React from 'react'

import Button from '@/components/formElements/Button'
import ObsLogo from '@/components/ui/ObsLogo'
import { getMenuByRole } from '@/helpers/menuUtils'
import useAuth from '@/hooks/useAuth'

import '@/styles/userSidebar.scss'

const AdminSidebar = () => {
  const pathname = usePathname()
  const { user } = useAuth()

  // Get admin menu items
  const menuItems = getMenuByRole('admin')

  const isActive = (link: string) => {
    if (pathname === link) return true
    else return pathname.includes(link.split('/')[2])
  }

  return (
    <div className="sidebar bg-white hidden md:flex flex-col h-[100dvh] min-w-[230px] fixed right-0 z-50 border-l border-divider">
      <div className="py-2 px-8 flex items-center justify-center border-b">
        <div className="text-center">
          <ObsLogo iconSize={120} />
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
              پنل ادمین
            </span>
          </div>
        </div>
      </div>
      
      <div className="py-3 flex flex-col justify-between h-full overflow-auto">
        <div className="flex flex-col gap-2 items-center justify-center">
          {menuItems.map((item: any, index) => (
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
        
        {/* User Info Section */}
        <div className="py-6 px-4 rounded-lg bg-background-50 flex flex-col gap-3 w-full">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-lg font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <p className="text-sm font-medium text-text-dark">{user?.name || 'ادمین'}</p>
            <p className="text-xs text-text-light">نقش: ادمین</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar

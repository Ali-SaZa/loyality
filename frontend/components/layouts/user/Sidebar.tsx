'use client'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

import Button from '@/components/formElements/Button'
import ObsLogo from '@/components/ui/ObsLogo'
import { getMenuByRole } from '@/helpers/menuUtils'
import MenuBurgerIcon from '@/components/icons/MenuBurgerIcon'
import CloseIcon from '@/components/icons/CloseIcon'

import '@/styles/userSidebar.scss'
import useAuth from '@/hooks/useAuth'

const UserSidebar = () => {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Get menu items based on user role
  const menuItems = getMenuByRole(user?.role || 'customer')

  const isActive = (link: string) => {
    if (pathname === link) return true
    else return pathname.includes(link.split('/')[2])
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800 border border-danger-200">
            پنل ادمین
          </span>
        )
      case 'store':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-success-100 text-success-800 border border-success-200">
            پنل فروشگاه
          </span>
        )
      case 'customer':
      default:
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 border border-primary-200">
            پنل مشتری
          </span>
        )
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Toggle sidebar menu"
      >
        {isMobileOpen ? <CloseIcon className="size-5" /> : <MenuBurgerIcon className="size-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        sidebar bg-white flex flex-col h-[100dvh] min-w-[250px] max-w-[250px] 
        border-l border-divider shadow-xl
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed md:relative right-0 top-0 z-40
        md:shadow-none md:border-r md:border-l-0
      `}>
        {/* Header */}
        <div className="py-4 px-6 flex items-center justify-center border-b border-divider bg-gradient-to-b from-background-50 to-white">
          <div className="text-center">
            <ObsLogo iconSize={100} />
            <div className="mt-3">
              {getRoleBadge(user?.role || 'customer')}
            </div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <div className="py-4 flex flex-col justify-between h-full overflow-auto">
          <div className="flex flex-col gap-1 px-3">
            {menuItems.map((item: any, index) => (
              <div
                key={index}
                className={`relative ${isActive(item.link) && 'sidebar-links-active'}`}
              >
                <Button
                  fullWidth
                  className={`justify-start h-12 px-4 rounded-xl transition-all duration-200 ${
                    isActive(item.link) 
                      ? 'bg-primary/10 text-primary border-primary/20' 
                      : 'hover:bg-background-100 hover:text-text-dark'
                  }`}
                  disabled={item.disable}
                  iconStart={item.icon(`size-5 ${isActive(item.link) ? 'text-primary' : 'text-text-light-25'}`)}
                  size="lg"
                  target={item?.target ? item?.target : '_self'}
                  to={item.link}
                  variant={isActive(item.link) ? 'flat' : 'light'}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <p className={`text-sm ${isActive(item.link) ? 'text-primary font-medium' : 'text-text-light-25'} leading-4 font-normal`}>
                    {item.title}
                  </p>
                </Button>
              </div>
            ))}
          </div>
          
          {/* User Info Section */}
          <div className="px-3 pb-4">
            <div className="py-4 px-4 rounded-xl bg-gradient-to-br from-background-50 to-background-100 border border-divider">
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <span className="text-white text-lg font-bold">
                    {user?.name?.charAt(0) || user?.phoneNumber?.charAt(0) || 'U'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-text-dark mb-1">
                  {user?.name || user?.phoneNumber || 'کاربر'}
                </p>
                <p className="text-xs text-text-light bg-white/60 rounded-full px-2 py-1 inline-block">
                  نقش: {user?.role === 'admin' ? 'ادمین' : user?.role === 'store' ? 'فروشگاه' : 'مشتری'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserSidebar

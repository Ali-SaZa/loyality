'use client'
import React, { useState } from 'react'
import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@heroui/navbar'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown'
import { Button } from '@heroui/button'
import { User } from '@heroui/user'

import ObsLogo from '@/components/ui/ObsLogo'
import MenuBurgerIcon from '@/components/icons/MenuBurgerIcon'
import CloseIcon from '@/components/icons/CloseIcon'
import LogoutIcon from '@/components/icons/LogoutIcon'
import EditIcon from '@/components/icons/EditIcon'
import BellIcon from '@/components/icons/BellIcon'
import { getMenuByRole } from '@/helpers/menuUtils'
import useAuth from '@/hooks/useAuth'
import useAlertModal from '@/hooks/useAlertModal'

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { showAlert } = useAlertModal()

  // Get admin menu items
  const menuItems = getMenuByRole('admin')

  const isActive = (link: string) => {
    return window.location.pathname === link
  }

  return (
    <>
      <NextUINavbar
        className="bg-white border-b border-divider"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden"
            icon={!isMenuOpen ? <MenuBurgerIcon /> : <CloseIcon />}
          />
          <NavbarBrand>
            <div className="flex items-center gap-3">
              <ObsLogo iconSize={80} />
              <div className="hidden md:block">
                <h1 className="text-lg font-bold text-text-dark">پنل مدیریت</h1>
                <p className="text-sm text-text-light">سیستم وفاداری</p>
              </div>
            </div>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent justify="end">
          {/* Notifications */}
          <Button
            isIconOnly
            variant="light"
            className="relative"
            aria-label="اعلان‌ها"
          >
            <BellIcon className="size-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
          </Button>

          {/* User Dropdown */}
          <Dropdown placement="bottom-start">
            <DropdownTrigger>
              <Button
                variant="light"
                className="flex items-center gap-2"
              >
                <User
                  avatarProps={{
                    src: user?.imageId
                      ? `/api/images/${user.imageId}`
                      : '/images/placeholders/man-placeholder.webp',
                  }}
                  className="[&_span.bg-default]:!bg-transparent"
                  description={user?.phoneNumber || 'ادمین'}
                  name={user?.name || 'ادمین سیستم'}
                />
              </Button>
            </DropdownTrigger>

            <DropdownMenu
              aria-label="User Actions"
              variant="flat"
            >
              <DropdownItem
                key="profile"
                href="/admin/profile"
                startContent={<EditIcon className="size-4" />}
              >
                ویرایش پروفایل
              </DropdownItem>
              <DropdownItem
                key="logout"
                className="text-danger"
                color="danger"
                startContent={<LogoutIcon className="size-4" />}
                onClick={() => showAlert('برای خروج مطمئن هستید؟', logout)}
              >
                خروج
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>

        {/* Mobile Menu */}
        <NavbarMenu className="bg-white pb-2">
          {menuItems.map((item, index) => (
            <NavbarMenuItem
              key={index}
              className={`px-4 w-full relative ${isActive(item.link) && 'sidebar-links-active'}`}
            >
              <Button
                fullWidth
                className="justify-start"
                disabled={item.disable}
                iconStart={item.icon()}
                size="lg"
                to={item.link}
                variant={isActive(item.link) ? 'flat' : 'light'}
                onClick={() => setIsMenuOpen(false)}
              >
                <p className="text-sm text-text-dark leading-4 font-normal">{item.title}</p>
              </Button>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem key="logout">
            <Button
              fullWidth
              color="danger"
              onClick={() => showAlert('برای خروج مطمئن هستید؟', logout)}
            >
              خروج
            </Button>
          </NavbarMenuItem>
        </NavbarMenu>
      </NextUINavbar>
    </>
  )
}

export default AdminNavbar

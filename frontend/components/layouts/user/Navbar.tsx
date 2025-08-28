'use client'
import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@heroui/navbar'
import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { getMenuByRole } from '@/helpers/menuUtils'
import Button from '@/components/formElements/Button'
import MenuBurgerIcon from '@/components/icons/MenuBurgerIcon'
import CloseIcon from '@/components/icons/CloseIcon'
import UserDropdown from '@/components/ui/UserDropdown'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon'
import useGlobal from '@/hooks/useGlobal'
import ObsLogo from '@/components/ui/ObsLogo'
import { truncateText } from '@/helpers'
import useAlertModal from '@/hooks/useAlertModal'
import useAuth from '@/hooks/useAuth'

interface NavbarProps {
  showBrand?: boolean
  title?: string
  menuChildren?: React.ReactNode
}

const UserNavbar = ({ showBrand = false, title, menuChildren }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data } = useGlobal()
  const { showAlert } = useAlertModal()
  const { logout, user } = useAuth()

  const router = useRouter()

  // Get menu items based on user role
  const menuItems = getMenuByRole(user?.role || 'customer')

  const isActive = (link: string) => {
    if (pathname === link) return true
    else if (pathname.includes(link.split('/')[2])) return true
    else return false
  }

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'admin':
        return 'پنل مدیریت'
      case 'store':
        return 'پنل فروشگاه'
      case 'customer':
      default:
        return 'پنل مشتری'
    }
  }

  return (
    <>
      <NextUINavbar
        className="bg-primary [&_header]:!max-w-none [&_header]:px-0 px-9"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent>
          <NavbarBrand>
            {pathname !== '/user' && !showBrand && (
              <Button
                iconOnly
                className="!rounded-full border-1 ml-2 hidden md:flex"
                color="default"
                variant="bordered"
                onClick={() => router.back()}
              >
                <ChevronRightIcon className="size-4 text-white" />
              </Button>
            )}
            {showBrand ? (
              <div className="border border-white bg-white/50 w-fit rounded-xl p-1">
                <ObsLogo iconSize={140} />
              </div>
            ) : (
              <div className="text-right">
                <p className="font-bold text-lg leading-8 text-white hidden md:block">
                  {title || data.navbar.title || getRoleTitle(user?.role || 'customer')}
                </p>
                <p className="text-sm text-white/80 hidden md:block">
                  {user?.firstName || user?.phoneNumber || 'کاربر'}
                </p>
              </div>
            )}
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          className="md:hidden"
          justify="center"
        >
          <p className="font-bold text-xs text-white">{truncateText(title || data.navbar.title || getRoleTitle(user?.role || 'customer'), 20)}</p>
        </NavbarContent>

        <NavbarContent
          className="hidden md:flex"
          justify="end"
        >
          <UserDropdown />
        </NavbarContent>

        {/* Mobile Menu */}
        <NavbarMenu className="bg-white pb-2">
          {menuChildren
            ? menuChildren
            : menuItems.map((item, index) => (
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

export default UserNavbar

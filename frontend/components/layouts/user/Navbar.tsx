'use client'
import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@heroui/navbar'
import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { siteConfig } from '@/config/site'
import Button from '@/components/formElements/Button'
import MenuBurgerIcon from '@/components/icons/MenuBurgerIcon'
import CloseIcon from '@/components/icons/CloseIcon'
import UserDropdown from '@/components/ui/UserDropdown'
import { GET_USER } from '@/services/user'
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

const Navbar = ({ showBrand = false, title, menuChildren }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data } = useGlobal()
  const { showAlert } = useAlertModal()
  const { logout } = useAuth()

  const router = useRouter()

  const handleClick = async () => {
    const res = await GET_USER()
  }

  const isActive = (link: string) => {
    if (pathname === link) return true
    else if (pathname.includes(link.split('/')[2])) return true
    else return false
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
                className="!rounded-full border-1 ml-2"
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
              <p className="font-bold text-lg leading-8 text-white hidden md:block">{title || data.navbar.title}</p>
            )}
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          className="md:hidden"
          justify="center"
        >
          <p className="font-bold text-xs text-white">{truncateText(title || data.navbar.title, 20)}</p>
        </NavbarContent>

        <NavbarContent
          className="hidden md:flex"
          justify="end"
        >
          {/* <NavbarItem>
            <Badge
              content="جدید"
              color="danger"
              size="sm"
            >
              <Button
                onClick={handleClick}
                iconOnly
                variant="bordered"
                className="rounded-full"
                color="default"
              >
                <CommentIcon className="size-4 text-white" />
              </Button>
            </Badge>
          </NavbarItem>
          <NavbarItem>
            <Button
              iconOnly
              variant="bordered"
              className="rounded-full"
              color="default"
            >
              <BellIcon className="size-4 text-white" />
            </Button>
          </NavbarItem> */}
          <UserDropdown />
        </NavbarContent>

        <NavbarContent
          className="flex md:hidden "
          justify="end"
        >
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden w-full justify-end"
            icon={
              !isMenuOpen ? (
                <div className="size-10 rounded-full flex items-center justify-center border-2">
                  <MenuBurgerIcon className="text-white size-6" />
                </div>
              ) : (
                <div className="size-10 rounded-full flex items-center justify-center border-2">
                  <CloseIcon className="text-white size-6" />
                </div>
              )
            }
          />
        </NavbarContent>

        <NavbarMenu className="bg-white pb-2">
          {menuChildren
            ? menuChildren
            : siteConfig.userSidebar.map((item, index) => (
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
          {/* {siteConfig.userSidebar.map((item, index) => (
            <NavbarMenuItem
              key={index}
              className={`px-4 w-full relative ${isActive(item.link) && 'sidebar-links-active'}`}
            >
              <CustomButton
                fullWidth
                iconStart={item.icon()}
                variant={isActive(item.link) ? 'flat' : 'light'}
                onClick={() => setIsMenuOpen(false)}
                size="lg"
                className="justify-start"
                to={item.link}
              >
                <p className="text-sm text-text-dark leading-4 font-normal">{item.title}</p>
              </CustomButton>
            </NavbarMenuItem>
          ))} */}
        </NavbarMenu>
      </NextUINavbar>
    </>
  )
}

export default Navbar

'use client'
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/navbar'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown'
import { Button as NextUiButton } from '@heroui/button'
import React, { useState } from 'react'
import { Accordion, AccordionItem } from '@heroui/accordion'
import { Link } from '@heroui/link'
import { usePathname } from 'next/navigation'

import UserDropdown from '../ui/UserDropdown'
import CloseIcon from '../icons/CloseIcon'
import MenuBurgerIcon from '../icons/MenuBurgerIcon'
import AngleDownIcon from '../icons/AngleDownIcon'
import ObsLogo from '../ui/ObsLogo'

import { siteConfig } from '@/config/site'
import useAuth from '@/hooks/useAuth'
import useWindowSize from '@/hooks/useWindowSize'
import Button from '@/components/formElements/Button'
import useAlertModal from '@/hooks/useAlertModal'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { showAlert } = useAlertModal()
  const { width } = useWindowSize()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const accordionItemClasses = {
    base: 'border-b',
    title: 'text-medium text-text-default',
    content: 'pr-4 pt-0 text-sm bg-background-50 rounded-lg',
  }

  const isActiveNavbarLink = (link: string) => {
    return pathname === link
  }

  return (
    <>
      <NextUINavbar
        className={`bg-background-primary fixed ${isMenuOpen ? 'bg-opacity-100' : 'bg-opacity-70'} [&_header]:!max-w-[1366px]`}
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="lg:hidden"
            icon={!isMenuOpen ? <MenuBurgerIcon /> : <React.Fragment />}
          />
          <NavbarBrand>
            {isMenuOpen ? (
              <div className="-mr-10">
                <ObsLogo
                  disableClick
                  iconSize={150}
                />
              </div>
            ) : width < 1024 ? (
              <ObsLogo iconSize={100} />
            ) : (
              <ObsLogo />
            )}
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent
          className="hidden lg:flex gap-4"
          justify="center"
        >
          {siteConfig.landingNavbar.map((item: any, index) => {
            switch (item.type) {
              case 'select':
                return (
                  <Dropdown key={index}>
                    <NavbarItem>
                      <DropdownTrigger>
                        <NextUiButton
                          disableRipple
                          color="primary"
                          endContent={<AngleDownIcon />}
                          radius="sm"
                          variant="flat"
                        >
                          {item.title}
                        </NextUiButton>
                      </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu
                      aria-label="Dropdown Variants"
                      className="w-full"
                      color="primary"
                      itemClasses={{
                        base: 'gap-4',
                      }}
                      variant="flat"
                    >
                      {item?.items!.map((selectItem: any, i: number) => (
                        <DropdownItem
                          key={i}
                          href={selectItem.link}
                          target={selectItem?.target ? selectItem?.target : '_self'}
                        >
                          {selectItem.title}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                )

              default:
                return (
                  <NavbarItem
                    key={index}
                    isActive={isActiveNavbarLink(item.link)}
                  >
                    <Button
                      className="font-normal"
                      target={item?.target ? item?.target : '_self'}
                      to={item.link}
                      variant={isActiveNavbarLink(item.link) ? 'solid' : 'flat'}
                    >
                      {item.title}
                    </Button>
                  </NavbarItem>
                )
            }
          })}
        </NavbarContent>
        {!isMenuOpen ? (
          <NavbarContent justify="end">{!user ? <Button to="/auth">همین الان ثبت نام کن</Button> : <UserDropdown />}</NavbarContent>
        ) : (
          <Button
            iconOnly
            variant="light"
            onClick={() => setIsMenuOpen(false)}
          >
            <CloseIcon />
          </Button>
        )}
        <NavbarMenu className="gap-0 bg-white">
          {siteConfig.landingNavbar.map((item: any, index) => {
            switch (item.type) {
              case 'select':
                return (
                  <NavbarMenuItem key={index}>
                    <Accordion
                      className="!px-0"
                      itemClasses={accordionItemClasses}
                      showDivider={false}
                    >
                      <AccordionItem
                        key="1"
                        aria-label="Accordion 1"
                        title={item.title}
                      >
                        {item.items.map((selectItem: any, i: number) => (
                          <Link
                            key={i}
                            className={`${i !== item.items!.length - 1 && 'border-b '} py-3 text-text-dark block text-sm font-light`}
                            href={selectItem.link}
                            target={selectItem?.target ? selectItem?.target : '_self'}
                            onPress={() => setIsMenuOpen(false)}
                          >
                            {selectItem.title}
                          </Link>
                        ))}
                      </AccordionItem>
                    </Accordion>
                  </NavbarMenuItem>
                )

              default:
                return (
                  <NavbarMenuItem
                    key={index}
                    className="border-b py-3"
                    isActive={isActiveNavbarLink(item.link)}
                  >
                    <Link
                      className={`text-medium font-light ${isActiveNavbarLink(item.link) ? 'text-primary font-semibold' : 'text-text-dark'} `}
                      href={item.link}
                      target={item?.target ? item?.target : '_self'}
                      onPress={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  </NavbarMenuItem>
                )
            }
          })}

          <NavbarMenuItem
            key="item6"
            className="mt-6"
          >
            {!user ? (
              <Button
                fullWidth
                to="/auth"
              >
                همین الان ثبت نام کن
              </Button>
            ) : (
              <Button
                fullWidth
                color="danger"
                onClick={() => showAlert('برای خروج مطمئن هستید؟', logout)}
              >
                خروج
              </Button>
            )}
          </NavbarMenuItem>
        </NavbarMenu>
      </NextUINavbar>
    </>
  )
}

export default Navbar

'use client'
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/dropdown'
import { NavbarItem } from '@heroui/navbar'
import { User } from '@heroui/user'
import React, { useMemo, useState } from 'react'

import LogoutIcon from '../icons/LogoutIcon'
import EditIcon from '../icons/EditIcon'
import DashboardIcon from '../icons/DashboardIcon'
import StyledUser from './StyledUser'

import { getMenuByRole } from '@/helpers/menuUtils'
import useAuth from '@/hooks/useAuth'
import useAlertModal from '@/hooks/useAlertModal'

interface UserDropdownProps {
  useNavbarItem?: boolean
  isOnDarkBackground?: boolean
}

const UserDropdown = ({ useNavbarItem = true, isOnDarkBackground }: UserDropdownProps) => {
  const { user, logout } = useAuth()
  const { showAlert } = useAlertModal()

  // Get menu items based on user role
  const menuItems = getMenuByRole(user?.role || 'customer')

  const disableKeys = useMemo(
    () =>
      menuItems
        .filter((item) => item.isShortAccess)
        .map((item, index) => item?.disable && String(index))
        .filter((item) => item !== undefined),
    [menuItems]
  )

  // Determine if we're on a dark background
  const shouldUseDarkBackground = isOnDarkBackground !== undefined ? isOnDarkBackground : useNavbarItem

  // Render the trigger based on context
  const renderTrigger = () => {
    const userComponent = (
      <StyledUser
        avatarSrc="/images/man-placeholder.webp"
        description={user?.phoneNumber}
        isOnDarkBackground={shouldUseDarkBackground}
        name={user?.firstName || user?.phoneNumber || 'کاربر'}
      />
    )

    if (useNavbarItem) {
      return <NavbarItem>{userComponent}</NavbarItem>
    }

    return userComponent
  }

  return (
    <>
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          {renderTrigger()}
        </DropdownTrigger>

        <DropdownMenu
          aria-label="User Actions"
          disabledKeys={disableKeys as any[]}
          variant="flat"
        >
          <DropdownSection showDivider>
            <DropdownItem
              key="user"
              className="h-14 gap-2"
              href="/customer"
              textValue="user"
            >
              <User
                avatarProps={{
                  src: '/images/man-placeholder.webp'
                }}
                className="[&_span.bg-default]:!bg-transparent"
                description={user?.phoneNumber}
                name={user?.firstName || user?.phoneNumber || 'کاربر'}
              />
            </DropdownItem>
          </DropdownSection>
          <DropdownSection
            showDivider
            title="صفحات پر کاربرد"
          >
            {menuItems
              .filter((item) => item.isShortAccess)
              .map((item, index) => (
                <DropdownItem
                  key={index}
                  href={item.link}
                  startContent={item.icon('size-5')}
                >
                  {item.title}
                </DropdownItem>
              ))}
          </DropdownSection>
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
    </>
  )
}

export default UserDropdown

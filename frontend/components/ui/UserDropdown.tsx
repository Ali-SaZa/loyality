'use client'
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/dropdown'
import { NavbarItem } from '@heroui/navbar'
import { User } from '@heroui/user'
import React, { useMemo, useState } from 'react'

import LogoutIcon from '../icons/LogoutIcon'
import EditIcon from '../icons/EditIcon'

import { fileAddress, getFullName } from '@/helpers'
import { getMenuByRole } from '@/helpers/menuUtils'
import useAuth from '@/hooks/useAuth'
import useAlertModal from '@/hooks/useAlertModal'

const UserDropdown = () => {
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

  return (
    <>
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <NavbarItem>
            <User
              avatarProps={{
                src: user?.imageId
                  ? fileAddress(user?.imageId)
                  : user?.sex === 'S_Male'
                    ? '/images/placeholders/man-placeholder.webp'
                    : user?.sex === 'S_Female'
                      ? '/images/placeholders/woman-placeholder.webp'
                      : '/images/placeholders/portrait.webp',
              }}
              className="[&_span.bg-default]:!bg-transparent"
              description={user?.mobile?.mobile}
              name={getFullName(user?.firstName, user?.lastName)}
            />
          </NavbarItem>
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
              href="/user"
              textValue="user"
            >
              <User
                avatarProps={{
                  src: user?.imageId
                    ? fileAddress(user?.imageId)
                    : user?.sex === 'S_Male'
                      ? '/images/placeholders/man-placeholder.webp'
                      : user?.sex === 'S_Female'
                        ? '/images/placeholders/woman-placeholder.webp'
                        : '/images/placeholders/portrait.webp',
                }}
                className="[&_span.bg-default]:!bg-transparent"
                description={user?.mobile?.mobile}
                name={getFullName(user?.firstName, user?.lastName)}
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
          <DropdownSection
            showDivider
            title="صفحات کاربر"
          >
            <DropdownItem
              key="profile"
              href="/auth/profile"
              startContent={<EditIcon className="size-4" />}
            >
              ویرایش پروفایل
            </DropdownItem>
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

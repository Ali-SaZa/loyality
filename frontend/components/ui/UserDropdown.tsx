'use client'
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@heroui/dropdown'
import { NavbarItem } from '@heroui/navbar'
import { User } from '@heroui/user'
import React, { useMemo, useState } from 'react'

import LogoutIcon from '../icons/LogoutIcon'
import EditIcon from '../icons/EditIcon'

import { fileAddress, getFullName } from '@/helpers'
import { siteConfig } from '@/config/site'
import useAuth from '@/hooks/useAuth'
import useAlertModal from '@/hooks/useAlertModal'

const UserDropdown = () => {
  const { user, logout } = useAuth()
  const { showAlert } = useAlertModal()

  const disableKeys = useMemo(
    () =>
      siteConfig.userSidebar
        .filter((item) => item.isShortAccess)
        .map((item, index) => item?.disable && String(index))
        .filter((item) => item !== undefined),
    [siteConfig.userSidebar]
  )

  return (
    <>
      <Dropdown placement="bottom-start">
        <NavbarItem>
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                src: user?.imageId
                  ? fileAddress(user?.imageId)
                  : user?.sex === 'S_Male'
                    ? '/images/placeholders/man-placeholder.webp'
                    : user?.sex === 'S_Female'
                      ? '/images/placeholders/woman-placeholder.webp'
                      : '/images/placeholders/portrait.webp',
              }}
              className="transition-transform bg-[#D9DEF1] border border-white py-1 px-2 text-text-dark [&_span]:!bg-[#D9DEF1]"
              name={getFullName(user?.firstName, user?.lastName)}
            />
          </DropdownTrigger>
        </NavbarItem>

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
            {siteConfig.userSidebar
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
            className="text-error"
            color="danger"
            startContent={<LogoutIcon className="size-4" />}
            onPress={() => showAlert('برای خروج مطمئن هستید؟', logout)}
          >
            خروج
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  )
}

export default UserDropdown

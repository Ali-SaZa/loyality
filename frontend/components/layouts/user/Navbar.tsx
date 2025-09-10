"use client";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getMenuByRole } from "@/helpers/menuUtils";
import Button from "@/components/formElements/Button";
import UserDropdown from "@/components/ui/UserDropdown";
import SmsBalanceDisplay from "@/components/ui/SmsBalanceDisplay";
import useGlobal from "@/hooks/useGlobal";
import LogoContainer from "@/components/ui/ObsLogo";
import { truncateText } from "@/helpers";
import useAlertModal from "@/hooks/useAlertModal";
import useAuth from "@/hooks/useAuth";
import { useSmsBalanceContext } from "@/context/SmsBalanceContext";
import { getRoleConfig } from "@/types/enums";

interface NavbarProps {
  showBrand?: boolean;
  title?: string;
  menuChildren?: React.ReactNode;
}

const UserNavbar = ({
  showBrand = false,
  title,
  menuChildren,
}: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data } = useGlobal();
  const { showAlert } = useAlertModal();
  const { logout, user } = useAuth();
  const { smsBalance, loading: smsLoading } = useSmsBalanceContext();

  const router = useRouter();

  // Get menu items based on user role
  const menuItems = getMenuByRole(user?.role || "customer");

  const isActive = (link: string) => {
    if (pathname === link) return true;
    else if (pathname.includes(link.split("/")[2])) return true;
    else return false;
  };

  const getRoleTitle = (role: string) => {
    return getRoleConfig(role).title;
  };

  return (
    <>
      <NextUINavbar
        className="bg-primary [&_header]:!max-w-none [&_header]:px-0 px-9"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent>
          <NavbarBrand>
            {showBrand ? (
              <div className="border border-white bg-white/50 w-fit rounded-xl p-1">
                <LogoContainer iconSize={140} />
              </div>
            ) : (
              <div className="text-right">
                <p className="font-bold text-lg leading-8 text-white hidden md:block">
                  {title ||
                    data.navbar.title ||
                    getRoleTitle(user?.role || "customer")}
                </p>
                <p className="text-sm text-white/80 hidden md:block">
                  {user?.firstName || user?.phoneNumber || "کاربر"}
                </p>
              </div>
            )}
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="md:hidden" justify="center">
          <p className="font-bold text-xs text-white">
            {truncateText(
              title ||
                data.navbar.title ||
                getRoleTitle(user?.role || "customer"),
              20,
            )}
          </p>
        </NavbarContent>

        <NavbarContent className="hidden md:flex" justify="end">
          {/* SMS Balance Display for Store Users */}
          {user?.role === "store" && smsBalance !== null && !smsLoading && (
            <div className="mr-4">
              <SmsBalanceDisplay balance={smsBalance} />
            </div>
          )}

          <UserDropdown isOnDarkBackground={true} />
        </NavbarContent>

        {/* Mobile Menu */}
        <NavbarMenu className="bg-white pb-2">
          {/* SMS Balance Display for Store Users - Mobile */}
          {user?.role === "store" && smsBalance !== null && !smsLoading && (
            <div className="px-4 py-2">
              <SmsBalanceDisplay balance={smsBalance} />
            </div>
          )}

          {menuChildren
            ? menuChildren
            : menuItems.map((item, index) => (
                <NavbarMenuItem
                  key={index}
                  className={`px-4 w-full relative ${isActive(item.link) && "sidebar-links-active"}`}
                >
                  <Button
                    fullWidth
                    className="justify-start"
                    disabled={item.disable}
                    iconStart={item.icon()}
                    size="lg"
                    to={item.link}
                    variant={isActive(item.link) ? "flat" : "light"}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <p className="text-sm text-text-dark leading-4 font-normal">
                      {item.title}
                    </p>
                  </Button>
                </NavbarMenuItem>
              ))}
          <NavbarMenuItem key="logout">
            <Button
              fullWidth
              color="danger"
              onClick={() => showAlert("برای خروج مطمئن هستید؟", logout)}
            >
              خروج
            </Button>
          </NavbarMenuItem>
        </NavbarMenu>
      </NextUINavbar>
    </>
  );
};

export default UserNavbar;

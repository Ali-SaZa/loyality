"use client";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import React, { useState } from "react";
import { Link } from "@heroui/link";
import { usePathname } from "next/navigation";

import UserDropdown from "../ui/UserDropdown";
import CloseIcon from "../icons/CloseIcon";
import MenuBurgerIcon from "../icons/MenuBurgerIcon";
import LogoContainer from "../ui/ObsLogo";

import { siteConfig } from "@/config/site";
import useAuth from "@/hooks/useAuth";
import useWindowSize from "@/hooks/useWindowSize";
import Button from "@/components/formElements/Button";
import useAlertModal from "@/hooks/useAlertModal";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { showAlert } = useAlertModal();
  const { width } = useWindowSize();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActiveNavbarLink = (link: string) => {
    return pathname === link;
  };

  return (
    <>
      <NextUINavbar
        className={`bg-background-primary fixed ${isMenuOpen ? "bg-background-primary" : "bg-background-primary/70"} [&_header]:!max-w-[1366px]`}
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="lg:hidden"
            icon={!isMenuOpen ? <MenuBurgerIcon /> : <React.Fragment />}
          />
          <NavbarBrand>
            {isMenuOpen ? (
              <div className="-mr-10">
                <LogoContainer disableClick iconSize={110} />
              </div>
            ) : width < 1024 ? (
              <LogoContainer iconSize={100} />
            ) : (
              <LogoContainer />
            )}
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="hidden lg:flex gap-4" justify="center">
          {siteConfig.landingNavbar.map((item: any, index) => (
            <NavbarItem
              key={index}
              isActive={isActiveNavbarLink(item.link)}
            >
              <Button
                className="font-normal"
                target={item?.target ? item?.target : "_self"}
                to={item.link}
                variant={isActiveNavbarLink(item.link) ? "solid" : "flat"}
              >
                {item.title}
              </Button>
            </NavbarItem>
          ))}
        </NavbarContent>
        {!isMenuOpen ? (
          <NavbarContent justify="end">
            {!user ? (
              <Button to="/auth">همین الان ثبت نام کن</Button>
            ) : (
              <UserDropdown />
            )}
          </NavbarContent>
        ) : (
          <Button iconOnly variant="light" onClick={() => setIsMenuOpen(false)}>
            <CloseIcon />
          </Button>
        )}
        <NavbarMenu className="gap-0 bg-white">
          {siteConfig.landingNavbar.map((item: any, index) => (
            <NavbarMenuItem
              key={index}
              className="border-b border-gray-200 py-3"
              isActive={isActiveNavbarLink(item.link)}
            >
              <Link
                className={`text-medium font-light ${isActiveNavbarLink(item.link) ? "text-primary font-semibold" : "text-text-dark"} `}
                href={item.link}
                target={item?.target ? item?.target : "_self"}
                onPress={() => setIsMenuOpen(false)}
              >
                {item.title}
              </Link>
            </NavbarMenuItem>
          ))}

          <NavbarMenuItem key="item6" className="mt-6">
            {!user ? (
              <Button fullWidth to="/auth">
                همین الان ثبت نام کن
              </Button>
            ) : (
              <Button
                fullWidth
                color="danger"
                onClick={() => showAlert("برای خروج مطمئن هستید؟", logout)}
              >
                خروج
              </Button>
            )}
          </NavbarMenuItem>
        </NavbarMenu>
      </NextUINavbar>
    </>
  );
};

export default Navbar;

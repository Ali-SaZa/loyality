import React from "react";
import { siteConfig } from "@/config/site";

export type UserRole = "customer" | "store" | "admin";

export interface MenuItem {
  title: string;
  icon: (className?: string) => React.ReactElement;
  link: string;
  isShortAccess: boolean;
  disable?: boolean;
  target?: string;
  children?: MenuItem[];
}

/**
 * Get the appropriate menu items based on user role
 * @param role - The user's role
 * @returns Array of menu items for the specified role
 */
export const getMenuByRole = (role: UserRole): MenuItem[] => {
  return siteConfig.roleMenus[role] || siteConfig.userSidebar;
};

/**
 * Get the default menu (fallback to customer menu)
 * @returns Array of menu items for customer role
 */
export const getDefaultMenu = (): MenuItem[] => {
  return siteConfig.roleMenus.customer || siteConfig.userSidebar;
};

/**
 * Check if a menu item should be visible based on user role and permissions
 * @param item - The menu item to check
 * @param userRole - The user's role
 * @returns Boolean indicating if the item should be visible
 */
export const isMenuItemVisible = (
  item: MenuItem,
  userRole: UserRole,
): boolean => {
  // Admin can see all items
  if (userRole === "admin") return true;

  // Store can see store-specific items
  if (userRole === "store") {
    return item.link.startsWith("/store") || item.link.startsWith("/user");
  }

  // Customer can see customer-specific items
  if (userRole === "customer") {
    return item.link.startsWith("/user");
  }

  return false;
};

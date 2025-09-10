"use client";
import React from "react";
import { usePathname } from "next/navigation";
import UserSidebar from "@/components/layouts/user/Sidebar";
import UserNavbar from "@/components/layouts/user/Navbar";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/types/enums";

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const pathname = usePathname();

  // Determine required role based on current path
  const getRequiredRole = (path: string): UserRole | undefined => {
    if (path.startsWith("/admin")) return UserRole.ADMIN;
    if (path.startsWith("/store")) return UserRole.STORE;
    if (path.startsWith("/customer")) return UserRole.CUSTOMER;
    return undefined; // Allow access to general user routes
  };

  const requiredRole = getRequiredRole(pathname);

  return (
    <RoleGuard requiredRole={requiredRole}>
      <div className="flex h-screen bg-background-50 overflow-hidden">
        <UserSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <UserNavbar />
          <main className="flex-1 overflow-y-auto bg-background-50 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
};

export default UserLayout;

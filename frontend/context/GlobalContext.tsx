"use client";
import { usePathname } from "next/navigation";
import { createContext, ReactNode, useEffect, useState } from "react";

import { siteConfig } from "@/config/site";
import { getMenuByRole } from "@/helpers/menuUtils";
import useAuth from "@/hooks/useAuth";
import CheckBoxIcon from "@/components/icons/CheckBoxIcon";
import CrossCircleIcon from "@/components/icons/CrossCircleIcon";
import CrossExclamationIcon from "@/components/icons/CrossExclamationIcon";
import { UserSidebarRoute } from "@/types";

const globalDefaultValues = {
  data: undefined,
  navbar: {
    title: "داشبورد",
  },
  difficultyLevels: [
    {
      code: "DL_Easy",
      name: "مقدماتی",
      color: "primary",
    },
    {
      code: "DL_Medium",
      name: "متوسط",
      color: "success",
    },
    {
      code: "DL_Hard",
      name: "پیشرفته",
      color: "error",
    },
  ],
  taskDifficultyLevels: [
    {
      code: "JSTDL_Easy",
      name: "مقدماتی",
      color: "primary",
    },
    {
      code: "JSTDL_Medium",
      name: "متوسط",
      color: "success",
    },
    {
      code: "JSTDL_Advanced",
      name: "پیشرفته",
      color: "error",
    },
  ],
  jobSimulationUsersStatus: [
    {
      code: "JSUS_InProgress",
      name: "درحال تکمیل",
      color: "primary",
    },
    {
      code: "JSUS_Completed",
      name: "تکمیل شده",
      color: "success",
    },
  ],
  sex: [
    {
      code: "S_Female",
      name: "زن",
      color: "error",
    },
    {
      code: "S_Male",
      name: "مرد",
      color: "primary",
    },
  ],
  howMeetUs: [
    {
      code: "UHMU_Friend",
      name: "دوستان",
      color: "primary",
    },
    {
      code: "UHMU_SocialMedia",
      name: "شبکه های اجتماعی",
      color: "success",
    },
    {
      code: "UHMU_SearchEngine",
      name: "موتور های جستجو",
      color: "warning",
    },
    {
      code: "UHMU_Other",
      name: "سایر",
      color: "error",
    },
  ],
  jobSimulationRequestHowMeetUs: [
    {
      code: "JSRHMU_Friend",
      name: "دوستان",
      color: "primary",
    },
    {
      code: "JSRHMU_SocialMedia",
      name: "شبکه های اجتماعی",
      color: "success",
    },
    {
      code: "JSRHMU_SearchEngine",
      name: "موتور های جستجو",
      color: "warning",
    },
    {
      code: "JSRHMU_Other",
      name: "سایر",
      color: "error",
    },
  ],
  educationLevel: [
    {
      code: "UEL_HighSchool",
      name: "دبیرستان",
      color: "primary",
    },
    {
      code: "UEL_Associate",
      name: "کاردانی",
      color: "success",
    },
    {
      code: "UEL_Bachelor",
      name: "لیسانس",
      color: "warning",
    },
    {
      code: "UEL_Master",
      name: "کارشناسی ارشد",
      color: "secondary",
    },
    {
      code: "UEL_Doctorate",
      name: "دکتری",
      color: "error",
    },
  ],
  educationStatus: [
    {
      code: "UES_InProgress",
      name: "درحال تکمیل",
      color: "primary",
    },
    {
      code: "UES_Completed",
      name: "تکمیل شده",
      color: "success",
    },
  ],
  orderStatus: [
    {
      code: "OS_Pending",
      name: "درحال پرداخت",
      color: "warning",
      icon: <CrossExclamationIcon className="size-4" />,
    },
    {
      code: "OS_Paid",
      name: "پرداخت شده",
      color: "success",
      icon: <CheckBoxIcon className="size-4" />,
    },
    {
      code: "OS_Canceled",
      name: "لغو شده",
      color: "danger",
      icon: <CrossCircleIcon className="size-4" />,
    },
  ],
  jobStatus: [
    {
      code: "UJSES_Student",
      name: "دانش‌آموز",
      color: "primary",
    },
    {
      code: "UJSES_Collegian",
      name: "دانشجو",
      color: "success",
    },
    {
      code: "UJSES_Employee",
      name: "کارمند",
      color: "warning",
    },
    {
      code: "UJSES_Unemployed",
      name: "بیکار",
      color: "secondary",
    },
    {
      code: "UJSES_Other",
      name: "سایر",
      color: "error",
    },
  ],
  skillLevel: [
    {
      code: "UJSESL_Beginner",
      name: "تازه کارم",
      color: "primary",
    },
    {
      code: "UJSESL_Intermediate",
      name: "متوسطم",
      color: "success",
    },
    {
      code: "UJSESL_Advanced",
      name: "حرفه ای ام",
      color: "warning",
    },
  ],
};

interface statusType {
  code: string;
  name: string;
  color: string;
  icon?: ReactNode;
}

interface DataState {
  data: any;
  navbar: {
    title: string;
    [key: string]: any;
  };

  difficultyLevels: statusType[];
  taskDifficultyLevels: statusType[];
  jobSimulationUsersStatus: statusType[];
  sex: statusType[];
  howMeetUs: statusType[];
  educationLevel: statusType[];
  educationStatus: statusType[];
  orderStatus: statusType[];
  jobStatus: statusType[];
  skillLevel: statusType[];
  jobSimulationRequestHowMeetUs: statusType[];

  [key: string]: any;
}

interface GlobalContextType {
  data: DataState;
  activeRoute: UserSidebarRoute;
  setData: (section: string, value: any) => void;
  getDataByCode: (section: string, code: string) => statusType;
  reset: () => void;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined,
);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [dataState, setDataState] = useState<DataState>(globalDefaultValues);

  // Get menu items based on user role
  const menuItems = getMenuByRole(user?.role || "customer");
  const [activeRoute, setActiveRoute] = useState<UserSidebarRoute>(
    menuItems[0],
  );

  useEffect(() => {
    const active =
      menuItems.find((item) => pathname === item.link) || menuItems[0];
    setActiveRoute(active);
  }, [pathname, menuItems]);

  const setData = (section: string, value: any) => {
    setDataState((prevData) => {
      return {
        ...prevData,
        [section]: {
          ...prevData[section],
          ...value,
        },
      };
    });
  };

  const getDataByCode = (section: string, code: string) => {
    return dataState[section].find((item: statusType) => item.code === code);
  };

  const reset = () => {
    setDataState(globalDefaultValues);
  };

  return (
    <GlobalContext.Provider
      value={{ data: dataState, activeRoute, setData, reset, getDataByCode }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

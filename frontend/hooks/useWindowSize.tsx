"use client";
import { useEffect, useState } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // تابع برای به‌روز رسانی سایز پنجره
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // تنظیم اولیه
    handleResize();

    // اضافه کردن event listener برای تغییر سایز
    window.addEventListener("resize", handleResize);

    // حذف event listener برای جلوگیری از memory leak
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;

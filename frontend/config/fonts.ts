import localFont from "next/font/local";

export const danaFont = localFont({
  src: [
    {
      path: "../public/fonts/DanaFaNum-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/DanaFaNum-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/DanaFaNum-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/DanaFaNum-DemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/DanaFaNum-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-dana",
});

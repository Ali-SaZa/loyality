"use client";
import { Swiper as SwiperModule } from "swiper/react";
import { A11y, Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/bundle";

import React, { useRef } from "react";
import { Swiper as SwiperInstance } from "swiper";
import "@/styles/swiper.scss";
import clsx from "clsx";

import ArrowLeftIcon from "../icons/ArrowLeftIcon";
import ArrowRightIcon from "../icons/ArrowRightIcon";

import Button from "@/components/formElements/Button";

interface SwiperProps {
  children: React.ReactNode;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  direction?: "horizontal" | "vertical";
  disablePagination?: boolean;
  onSlideChange?: (swiper: any) => void;
  loopOff?: boolean;
}

const Swiper = ({
  children,
  color = "primary",
  direction = "horizontal",
  disablePagination = false,
  onSlideChange,
  loopOff = false,
}: SwiperProps) => {
  const swiperRef = useRef<SwiperInstance | null>(null);

  return (
    <SwiperModule
      autoplay={{
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      breakpoints={{
        240: {
          slidesPerView: 1.09,
          spaceBetween: 0,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 0,
        },
        768: {
          slidesPerView: 2.4,
          spaceBetween: 0,
        },
        1024: {
          slidesPerView: 2.7,
          spaceBetween: 0,
        },
        1280: {
          slidesPerView: 4.05,
          spaceBetween: 0,
        },
      }}
      className={clsx("!pt-4 !px-2 max-h-[933px]", color)}
      dir="rtl"
      direction={direction}
      loop={!loopOff}
      modules={[Pagination, A11y, Autoplay]}
      pagination={disablePagination ? false : { clickable: true }}
      onMouseEnter={() => swiperRef.current?.autoplay.pause()}
      onMouseLeave={() => swiperRef.current?.autoplay.start()}
      onSlideChange={onSlideChange}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
    >
      {children}

      {!disablePagination && (
        <div className="flex items-center gap-4 mt-6">
          <Button
            iconOnly
            className="rounded-full"
            color={color}
            size="lg"
            variant="bordered"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ArrowRightIcon
              className="size-[30px]"
              color={color === "primary" ? "#3A4D9A" : "#dec56b"}
            />
          </Button>
          <Button
            iconOnly
            className="rounded-full"
            color={color}
            size="lg"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ArrowLeftIcon className="size-[30px]" />
          </Button>
        </div>
      )}
    </SwiperModule>
  );
};

export default Swiper;

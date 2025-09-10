"use client";
import React, { useEffect, useRef } from "react";

import TickIcon from "../icons/TickIcon";

import useGlobal from "@/hooks/useGlobal";

interface StepperProps {
  currentStep: number;
  stepsDetail: {
    title: string;
    difficultyLevel: string;
    estimatedHours: number;
    [key: string]: any;
  }[];
}

const UserVerticalStepper = ({ currentStep, stepsDetail }: StepperProps) => {
  const { data } = useGlobal();
  const activeStepRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isActiveStep = (step: number) => currentStep === step;

  useEffect(() => {
    if (activeStepRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeStep = activeStepRef.current;

      // موقعیت استپ فعال نسبت به کانتینر
      const containerRect = container.getBoundingClientRect();
      const activeStepRect = activeStep.getBoundingClientRect();

      // محاسبه مکان دقیق اسکرول
      const scrollPosition = activeStep.clientHeight * currentStep;

      // اگر موقعیت درست باشد، اسکرول انجام شود
      if (
        activeStepRect.top >= containerRect.top &&
        activeStepRect.bottom <= containerRect.bottom
      ) {
        container.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, [currentStep]);

  return (
    <div ref={containerRef} className="max-h-[300px] overflow-y-auto">
      {stepsDetail.map((item, index) => (
        <div
          key={index}
          ref={isActiveStep(index) ? activeStepRef : null}
          className="flex gap-3"
        >
          <div className="flex flex-col items-center">
            <div
              className={`size-8 min-w-8 min-h-8 rounded-full ${currentStep >= index ? "bg-primary" : "bg-background-50"} flex items-center justify-center`}
            >
              {isActiveStep(index) ? (
                <div className="size-3 min-w-3 min-h-3 rounded-full bg-white" />
              ) : currentStep > index ? (
                <TickIcon className="text-white size-5 min-w-5 min-h-5" />
              ) : (
                <div className="size-3 min-w-3 min-h-3 rounded-full bg-white" />
              )}
            </div>
            {index !== data.length - 1 && (
              <div
                className={`w-[3px] h-[86px] ${currentStep > index ? "bg-primary" : "bg-background-50"} rounded-xl my-1`}
              />
            )}
          </div>
          <div className="flex flex-col gap-3 mt-1">
            <p
              className={`font-bold leading-6 ${isActiveStep(index) ? "text-primary-100" : "text-text"}`}
            >
              ماموریت {index + 1}
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`${currentStep >= index ? "bg-primary" : "bg-background-50"} size-2 min-w-2 min-h-2 rounded-full`}
                />
                <p
                  className={`${isActiveStep(index) ? "text-primary" : "text-text-light-25"} text-sm leading-4`}
                >
                  {item.title}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`${currentStep >= index ? "bg-primary" : "bg-background-50"} size-2 min-w-2 min-h-2 rounded-full`}
                />
                <p
                  className={`${isActiveStep(index) ? "text-primary" : "text-text-light-25"} text-sm leading-4`}
                >
                  {item.estimatedHours} ساعت
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`${currentStep >= index ? "bg-primary" : "bg-background-50"} size-2 min-w-2 min-h-2 rounded-full`}
                />
                <p
                  className={`${isActiveStep(index) ? "text-primary" : "text-text-light-25"} text-sm leading-4`}
                >
                  {
                    data.taskDifficultyLevels.find(
                      (dl) => dl.code === item.difficultyLevel,
                    )?.name
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <div
            className={`size-8 min-w-8 min-h-8 rounded-full ${currentStep < stepsDetail.length ? "bg-background-50" : "bg-primary"} flex items-center justify-center`}
          >
            {currentStep < stepsDetail.length ? (
              <div className="size-3 min-w-3 min-h-3 rounded-full bg-white" />
            ) : (
              <TickIcon className="text-white size-5 min-w-5 min-h-5" />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-1">
          <p className="font-bold leading-6">پایان و دریافت گواهینامه</p>
        </div>
      </div>
    </div>
  );
};

export default UserVerticalStepper;

"use client";
import React from "react";

import CheckIcon from "../icons/CheckIcon";

import Button from "@/components/formElements/Button";
import useWindowSize from "@/hooks/useWindowSize";

interface StepperProps {
  currentStep: number;
  numberOfSteps: number;
  stepsDetail: {
    step: number;
    text: string;
  }[];
}

const Stepper = ({ currentStep, numberOfSteps, stepsDetail }: StepperProps) => {
  const { width } = useWindowSize();

  const activeColor = (index: number) =>
    currentStep > index
      ? "bg-success"
      : currentStep === index
        ? "bg-primary"
        : "bg-default";
  const isFinalStep = (index: number) => index === numberOfSteps - 1;

  const currentStepDetail = (index: number) =>
    stepsDetail.find((stepDetail) => stepDetail.step === index);

  return (
    <div className="flex items-center w-full justify-center">
      {Array.from({ length: numberOfSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center justify-center">
            <div
              className={`size-8 rounded-full flex items-center justify-center text-white ${activeColor(index)}`}
            >
              {currentStep > index ? (
                <CheckIcon className="size-5 text-white" />
              ) : (
                index + 1
              )}
            </div>
            <Button
              className="mt-4"
              color={
                currentStep > index
                  ? "success"
                  : currentStep === index
                    ? "primary"
                    : "default"
              }
              disabled={index > currentStep}
              size={width <= 768 ? "sm" : "md"}
              variant="flat"
            >
              {currentStepDetail(index)!.text}
            </Button>
          </div>
          {isFinalStep(index) ? null : (
            <div
              className={`w-36 h-[2px] md:mx-8 rounded-full -mt-14 ${index >= currentStep ? "bg-default" : "bg-primary"}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;

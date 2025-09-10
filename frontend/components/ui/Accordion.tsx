"use client";
import { Accordion as NextUiAccordion, AccordionItem } from "@heroui/accordion";
import React, { useState } from "react";

import Button from "@/components/formElements/Button";

import ArrowRightIcon from "../icons/ArrowRightIcon";
import ArrowLeftIcon from "../icons/ArrowLeftIcon";
import "@/styles/accordion.scss";
import HtmlRenderer from "../utils/HtmlRenderer";

type accordionDataPropsType = {
  id: number;
  key: string;
  title: string;
  content: string;
};

interface CustomAccordionProps {
  accordionData: accordionDataPropsType[];
  hideNavigation?: boolean;
  hideStartContent?: boolean;
  hideIndicator?: boolean;
  showDivider?: boolean;
  titleClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  startContentClassName?: string;
  indicator?: React.ReactNode;
  defaultSelectedKeys?: string[];
  color?: "primary" | "secondary";
  selectionMode?: "none" | "single" | "multiple";
  onKeyChange?: (newKey: string) => void;
  page?: "questions";
  contentIsHtml?: boolean;
}

const Accordion = ({
  accordionData,
  hideNavigation = false,
  hideStartContent = false,
  hideIndicator = false,
  showDivider = false,
  titleClassName = "",
  triggerClassName = "",
  contentClassName = "",
  startContentClassName = "",
  indicator,
  defaultSelectedKeys = ["1"],
  color = "secondary",
  onKeyChange,
  page,
  contentIsHtml = false,
}: CustomAccordionProps) => {
  const [selectedKeys, setSelectedKeys] = useState(defaultSelectedKeys);
  const accordionItemClasses = {
    content: `text-white text-sm pt-0 ${contentClassName}`,
  };
  const handleChangeAccordion = (sk: any) => {
    const newKey = sk.currentKey;

    setSelectedKeys([newKey]);

    // فراخوانی prop در صورت وجود
    if (onKeyChange) {
      onKeyChange(newKey);
    }
  };
  const isActiveAccordion = (data: accordionDataPropsType) => {
    return !!selectedKeys.find((sk) => sk === data.key);
  };

  const getActiveCurrentAccordionIndex = () => {
    return accordionData.findIndex((data) => data.key === selectedKeys[0]);
  };

  const handleAccordionNext = () => {
    if (getActiveCurrentAccordionIndex() !== accordionData.length - 1) {
      setSelectedKeys([
        `${accordionData[getActiveCurrentAccordionIndex() + 1].key}`,
      ]);
    } else {
      setSelectedKeys([`${accordionData[0].key}`]);
    }
  };

  const handleAccordionBack = () => {
    if (getActiveCurrentAccordionIndex() !== 0) {
      setSelectedKeys([
        `${accordionData[getActiveCurrentAccordionIndex() - 1].key}`,
      ]);
    } else {
      setSelectedKeys([`${accordionData[accordionData.length - 1].key}`]);
    }
  };

  return (
    <div>
      <NextUiAccordion
        className="!px-0 custom-accordion"
        hideIndicator={hideIndicator}
        itemClasses={accordionItemClasses}
        selectedKeys={selectedKeys}
        showDivider={showDivider}
        onSelectionChange={handleChangeAccordion}
      >
        {accordionData.map((data) => (
          <AccordionItem
            key={data.key}
            aria-label="Accordion 1"
            classNames={{
              title: `${isActiveAccordion(data) ? "text-white font-bold text-xl" : "text-white/50 text-lg"} leading-8 ${titleClassName}`,
              base: `${page && page === "questions" ? `${isActiveAccordion(data) && "bg-background-50 bg-background-50 rounded-xl my-2"} p-4` : ""}`,
              trigger: triggerClassName,
            }}
            indicator={indicator}
            startContent={
              !hideStartContent && (
                <div
                  className={`${isActiveAccordion(data) ? `bg-${color} text-white` : "bg-background-70/50 text-white/50"} size-9 rounded-full flex items-center justify-center ${startContentClassName}`}
                >
                  {data.id}
                </div>
              )
            }
            title={data.title}
          >
            {contentIsHtml ? (
              <HtmlRenderer htmlContent={data.content} />
            ) : (
              data.content
            )}
          </AccordionItem>
        ))}
      </NextUiAccordion>
      {!hideNavigation && (
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-4">
            <Button
              iconOnly
              className="rounded-full"
              color={color}
              size="lg"
              variant="bordered"
              onClick={handleAccordionBack}
            >
              <ArrowRightIcon className="size-[30px]" color="#dec56b" />
            </Button>
            <Button
              iconOnly
              className="rounded-full"
              color={color}
              size="lg"
              onClick={handleAccordionNext}
            >
              <ArrowLeftIcon className="size-[30px]" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {accordionData.map((data, index) => (
              <div
                key={index}
                className={`transition-all duration-300 ease-linear size-[15px] rounded-full bg-background-70 ${index === getActiveCurrentAccordionIndex() && "bg-secondary w-[45px]"}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Accordion;

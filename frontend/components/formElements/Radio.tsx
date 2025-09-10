import React, { PropsWithChildren } from "react";
import { Radio as NextUiRadio, RadioProps } from "@heroui/radio";
import { cn } from "@heroui/theme";

const Radio = ({
  children,
  className,
  ...otherProps
}: PropsWithChildren<RadioProps>) => {
  return (
    <NextUiRadio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 hover:bg-content2 items-center",
          "w-full max-w-full cursor-pointer rounded-xl gap-2 px-4 py-2 border-2 border-[#ebebeb]",
          "data-[selected=true]:border-primary",
          className,
        ),
      }}
    >
      {children}
    </NextUiRadio>
  );
};

export default Radio;

"use client";
import React from "react";

const CommentSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col pb-28">
      <div className="flex flex-col container pt-10 md:pt-16 pb-10 relative">
        <p className="font-bold text-text-dark text-lg md:text-3xl pb-2 md:pb-6 text-center flex items-center justify-center w-full gap-2">
          {title}
          <img
            alt="quote mark"
            className="w-[54px] md:w-[82px] opacity-40 pb-6"
            src="/images/quote.png"
          />
        </p>
        <p className="text-sm md:text-lg text-center">{description}</p>
      </div>
      <div className="w-full container">{children}</div>
    </div>
  );
};

export default CommentSection;

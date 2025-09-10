import React from "react";

const Hashtag = ({
  className = "",
  text,
}: {
  className?: string;
  text: string;
}) => {
  return (
    <div
      className={`rounded-md py-1 px-2 border-primary text-center text-xs text-primary border-2 h-fit ${className}`}
    >
      &#35;{text}
    </div>
  );
};

export default Hashtag;

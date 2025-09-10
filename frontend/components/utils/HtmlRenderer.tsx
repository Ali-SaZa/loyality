import React, { useEffect, useRef, useState } from "react";

import Button from "../formElements/Button";

const HtmlRenderer = ({ htmlContent }: { htmlContent: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const currentHeight = contentRef.current.scrollHeight;
      const maxHeight = 150; // حداکثر ارتفاع برای متن

      if (currentHeight > maxHeight) {
        setIsTruncated(true);
      }
    }
  }, [htmlContent]);

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        ref={contentRef}
        className={`no-reset overflow-hidden ${isExpanded ? "max-h-full" : "max-h-[150px]"}`}
      />
      {isTruncated && (
        <Button
          fullWidth
          className="mt-4"
          size="sm"
          variant="light"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "نمایش کمتر" : "نمایش بیشتر"}
        </Button>
      )}
    </div>
  );
};

export default HtmlRenderer;

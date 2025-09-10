import React from "react";

import NotFoundIcon from "../icons/NotFoundIcon";

interface EmptyListPlaceholderProps {
  title?: string;
  description?: string;
}

const EmptyListPlaceholder = ({
  title = "نتیجه‌ای یافت نشد",
  description = "گزینه های جستجو یا فیلتر خود را تنظیم کنید تا آنچه را که به دنبال آن هستید بیابید.",
}: EmptyListPlaceholderProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 my-10">
      <NotFoundIcon />
      <div className="flex flex-col items-center gap-2">
        <p className="text-text-dark font-semibold">{title}</p>
        <p className="text-text-light-25 text-sm text-center">{description}</p>
      </div>
    </div>
  );
};

export default EmptyListPlaceholder;

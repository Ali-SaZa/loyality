import { useContext } from "react";

import { LoadingContext } from "@/context/LoadingContext";

const useLoading = () => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useLoading باید درون LoadingProvider استفاده شود");
  }

  return context;
};

export default useLoading;

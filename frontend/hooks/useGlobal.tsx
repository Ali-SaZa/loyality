import { useContext } from "react";

import { GlobalContext } from "@/context/GlobalContext";

const useGlobal = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobalContext باید درون GlobalProvider استفاده شود");
  }

  return context;
};

export default useGlobal;

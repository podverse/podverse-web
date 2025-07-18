import React, { createContext, useContext, useState, ReactNode } from "react";

type LoadingSpinnerGlobalContextType = {
  isLoadingGlobal: boolean;
  setIsLoadingGlobal: (val: boolean) => void;
};

const LoadingSpinnerGlobalContext = createContext<LoadingSpinnerGlobalContextType | undefined>(undefined);

export const LoadingSpinnerGlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);

  return (
    <LoadingSpinnerGlobalContext.Provider value={{ isLoadingGlobal, setIsLoadingGlobal }}>
      {children}
    </LoadingSpinnerGlobalContext.Provider>
  );
};

export const useLoadingSpinnerGlobal = () => {
  const ctx = useContext(LoadingSpinnerGlobalContext);
  if (!ctx) throw new Error("useLoadingSpinnerGlobal must be used within a LoadingSpinnerGlobalProvider");
  return ctx;
};

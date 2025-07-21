import { DTOCategory } from "podverse-helpers";
import React, { createContext, useState, ReactNode } from "react";
import { useContext } from "react";

type CategoriesContextType = {
  categories: DTOCategory[];
};

export const CategoriesContext = createContext<CategoriesContextType>({
  categories: [],
});

type CategoriesProviderProps = {
  children: ReactNode;
  ssrCategories?: DTOCategory[];
};

export const CategoriesProvider = ({
  children,
  ssrCategories = [],
}: CategoriesProviderProps) => {
  const [categories] = useState<DTOCategory[]>(ssrCategories);

  return (
    <CategoriesContext.Provider value={{ categories }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error("useCategories must be used within a CategoriesProvider");
  return ctx;
}
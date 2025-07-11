import React, { createContext, useState, ReactNode } from "react";

type AccountContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
};

export const AccountContext = createContext<AccountContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AccountContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AccountContext.Provider>
  );
};
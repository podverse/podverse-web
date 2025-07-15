import { DTOAccount } from "podverse-helpers";
import React, { createContext, useState, ReactNode } from "react";

type AccountContextType = {
  loggedInAccount: DTOAccount | null;
  setLoggedInAccount: (val: DTOAccount | null) => void;
};

export const AccountContext = createContext<AccountContextType>({
  loggedInAccount: null,
  setLoggedInAccount: () => {},
});

type AccountProviderProps = {
  children: ReactNode;
  ssrLoggedInAccount?: DTOAccount | null;
};

export const AccountProvider = ({
  children,
  ssrLoggedInAccount = null,
}: AccountProviderProps) => {
  const [loggedInAccount, setLoggedInAccount] = useState<DTOAccount | null>(ssrLoggedInAccount);

  return (
    <AccountContext.Provider value={{ loggedInAccount, setLoggedInAccount }}>
      {children}
    </AccountContext.Provider>
  );
};
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type NavigationType = "push" | "pop" | null;

const BACK_NAV_FLAG_KEY = "pv-back-nav";

interface NavigationContextType {
  navigationType: NavigationType;
  isBackNavigation: boolean;
  clearBackNavigationFlag: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  navigationType: null,
  isBackNavigation: false,
  clearBackNavigationFlag: () => {},
});

/**
 * Check if this is a back navigation by reading the sessionStorage flag.
 * This is synchronous and can be called during render.
 * The flag is NOT cleared by this function - call clearBackNavFlag() after restoration is complete.
 */
export function checkBackNavFlag(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(BACK_NAV_FLAG_KEY) === "true";
}

/**
 * Clear the back navigation flag from sessionStorage.
 * Call this after scroll restoration is complete.
 */
export function clearBackNavFlag(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(BACK_NAV_FLAG_KEY);
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [navigationType, setNavigationType] = useState<NavigationType>(null);
  const [isBackNavigation, setIsBackNavigation] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      // Set sessionStorage flag synchronously for immediate detection during render
      sessionStorage.setItem(BACK_NAV_FLAG_KEY, "true");
      // Also set React state for effects that depend on it
      setNavigationType("pop");
      setIsBackNavigation(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const clearBackNavigationFlag = useCallback(() => {
    clearBackNavFlag();
    setIsBackNavigation(false);
    setNavigationType(null);
  }, []);

  return (
    <NavigationContext.Provider value={{ 
      navigationType, 
      isBackNavigation, 
      clearBackNavigationFlag 
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => useContext(NavigationContext);

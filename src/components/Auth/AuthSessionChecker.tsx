"use client";

import { useEffect } from "react";
import { apiRequestService } from "../../factories/apiRequestService";

interface AuthSessionCheckerProps {
  ssrShouldLogout: boolean;
}

const AuthSessionChecker = ({ ssrShouldLogout }: AuthSessionCheckerProps) => {
  useEffect(() => {
    if (ssrShouldLogout) {
      (async () => {
        try {
          await apiRequestService.reqAuthLogout();
        } catch {
          // Logout may fail if session is already invalid, that's ok
        }
        // Reload to clear client state and show logged-out UI
        window.location.reload();
      })();
    }
  }, [ssrShouldLogout]);

  return null;
};

export default AuthSessionChecker;

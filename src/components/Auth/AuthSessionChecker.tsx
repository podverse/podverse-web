"use client";

import { useEffect } from "react";
import { apiRequestService } from "../../factories/apiRequestService";

interface AuthSessionCheckerProps {
  ssrShouldLogout: boolean;
}

const AuthSessionChecker = ({ ssrShouldLogout }: AuthSessionCheckerProps) => {
  useEffect(() => {
    console.log('AuthSessionChecker SSR Should Logout:', ssrShouldLogout);
    if (ssrShouldLogout) {
      (async () => {
        console.log('AuthSessionChecker logging out due to invalid SSR session');
        await apiRequestService.reqAuthLogout();
        console.log('AuthSessionChecker after logout');
      })();
    }
  }, [ssrShouldLogout]);

  return null;
};

export default AuthSessionChecker;

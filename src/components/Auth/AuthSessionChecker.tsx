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
        await apiRequestService.reqAuthLogout();
      })();
    }
  }, [ssrShouldLogout]);

  return null;
};

export default AuthSessionChecker;

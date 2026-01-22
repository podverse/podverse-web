"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MainHeader } from "../../components/Main/MainHeader";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { FormInfoMessageText } from "../../components/Form/FormInfoMessageText";
import { FormErrorMessageText } from "../../components/Form/FormErrorMessageText";
import { apiRequestService } from "../../factories/apiRequestService";
import { handleRateLimitAlert } from "../../utils/rateLimit/rateLimitAlert";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styles from "../../styles/app/verify-email/VerifyEmailClient.module.scss";

type VerifyEmailClientProps = {
  token?: string;
};

export function VerifyEmailClient({ token }: VerifyEmailClientProps) {
  const tAuthentication = useTranslations("authentication");
  const tMisc = useTranslations("misc");
  const locale = useLocale();

  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const verify = async () => {
      if (!token) {
        setIsVerifying(false);
        setIsError(true);
        return;
      }
      try {
        setIsVerifying(true);
        setIsError(false);
        setIsSuccess(false);
        await apiRequestService.reqAccountVerifyEmail({ token });
        setIsSuccess(true);
        // Redirect after 3 seconds (hard reload)
        timeoutId = setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } catch (err: any) {
        const rateLimitHandled = await handleRateLimitAlert(err, locale, tMisc);
        if (!rateLimitHandled) {
          setIsError(true);
        }
      } finally {
        setIsVerifying(false);
      }
    };
    verify();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <MainHeader title={tAuthentication("verify_email")} />
      <MainWrapper>
        <MainInnerWrapper>
          <MainInnerContentWrapper>
            <div className={styles.contentWrapper}>
              {isVerifying && (
                <div className={styles.messageSection}>
                  <FormInfoMessageText message={tAuthentication("verifying_email_address")} />
                  <LoadingSpinner size="medium" />
                </div>
              )}
              {!isVerifying && isSuccess && (
                <div className={styles.messageSection}>
                  <FormInfoMessageText message={tAuthentication("email_verified")} />
                  <FormInfoMessageText message={tMisc("redirecting")} />
                </div>
              )}
              {!isVerifying && isError && (
                <div className={styles.messageSection}>
                  <FormErrorMessageText message={tAuthentication("verification_failed")} />
                </div>
              )}
            </div>
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </>
  );
}

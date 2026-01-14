import { useTranslations } from "next-intl";
import { MainHeader } from "../../components/Main/MainHeader";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { AuthSignUpForm } from "../../components/Auth/AuthSignUpForm";
import { AuthContactOnlyMessage } from "../../components/Auth/AuthContactOnlyMessage";
import { config } from "../../config";

export function SignUpClient() {
  const tAuthentication = useTranslations("authentication");
  const signupMode = config.public.account.signupMode;
  const contactEmail = config.public.account.contactEmail;

  return (
    <>
      <MainHeader title={tAuthentication("sign_up")} />
      <MainWrapper>
        <MainInnerWrapper>
          <MainInnerContentWrapper>
            {signupMode === 'contact-only' && contactEmail ? (
              <AuthContactOnlyMessage contactEmail={contactEmail} />
            ) : (
              <AuthSignUpForm />
            )}
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </>
  )
}

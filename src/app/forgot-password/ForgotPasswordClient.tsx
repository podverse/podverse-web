import { useTranslations } from "next-intl";
import { MainHeader } from "../../components/Main/MainHeader";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { AuthForgotPasswordForm } from "../../components/Auth/AuthForgotPasswordForm";

export function ForgotPasswordClient() {
  const tAuthentication = useTranslations("authentication");

  return (
    <>
      <MainHeader title={tAuthentication("forgot_password")} />
      <MainWrapper>
        <MainInnerWrapper>
          <MainInnerContentWrapper>
            <AuthForgotPasswordForm />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </>
  )
}

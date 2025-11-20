import { useTranslations } from "next-intl";
import { MainHeader } from "../../components/Main/MainHeader";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { AuthSignUpForm } from "../../components/Auth/AuthSignUpForm";

export function SignUpClient() {
  const tAuthentication = useTranslations("authentication");

  return (
    <>
      <MainHeader title={tAuthentication("sign_up")} />
      <MainWrapper>
        <MainInnerWrapper>
          <MainInnerContentWrapper>
            <AuthSignUpForm />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </>
  )
}

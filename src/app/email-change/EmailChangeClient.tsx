import { useTranslations } from "next-intl";
import { MainHeader } from "../../components/Main/MainHeader";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { AuthEmailChangeForm } from "../../components/Auth/AuthEmailChangeForm";

export function EmailChangeClient() {
  const tAuthentication = useTranslations("authentication");

  return (
    <>
      <MainHeader title={tAuthentication("change_email_address_email")} />
      <MainWrapper>
        <MainInnerWrapper>
          <MainInnerContentWrapper>
            <AuthEmailChangeForm />
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </>
  )
}

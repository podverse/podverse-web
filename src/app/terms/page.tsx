import React from "react";
import { getTranslations } from "next-intl/server";
import { MainHeader } from "../../components/Main/MainHeader";
import { MainWrapper } from "../../components/Main/MainWrapper";
import { MainInnerWrapper } from "../../components/Main/MainInnerWrapper";
import { MainInnerContentWrapper } from "../../components/Main/MainInnerContentWrapper";
import { SideContent } from "../../components/SideContent/SideContent";

export default async function TermsPage() {
  const t = await getTranslations("terms");

  return (
    <>
      <MainHeader title={t("terms")} />
      <MainWrapper>
        <MainInnerWrapper>
          <SideContent />
          <MainInnerContentWrapper>
            <section>
              <p>{t("never_sell_data")}</p>
              <br />
              <p>{t("no_ads_without_permission")}</p>
              <br />
              <p>{t("audio_video_hosting")}</p>
              <br />
              <p>{t("third_party_feeds")}</p>
              <br />
              <p>{t("clips_crowdsourced")}</p>
              <br />
              <p>{t("clips_load_full_episode")}</p>
              <br />
              <p>{t("reduced_size_images")}</p>
            </section>
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </>
  );
}

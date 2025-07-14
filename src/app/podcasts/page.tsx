import { getTranslations } from "next-intl/server";
import React from "react";
import Header from "../../components/Header/Header";
import MainWrapper from "../../components/MainWrapper/MainWrapper";

export default async function Podcasts() {
  const tMedia = await getTranslations('media');

  return (
    <>
      <Header title={tMedia("podcast.podcasts")} />
      <MainWrapper>
        <p>{tMedia("podcast.podcasts")}</p>
      </MainWrapper>
    </>
  );
}
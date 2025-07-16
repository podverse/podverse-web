import { getTranslations } from "next-intl/server";
import React from "react";
import Header from "../../components/Header/Header";
import MainWrapper from "../../components/MainWrapper/MainWrapper";
import PodcastList from "../../components/Podcast/PodcastList";
import { getSSRApiRequestService } from "../../factories/apiRequestService";
import { z } from "zod";

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional(),
});

export default async function Podcasts({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const tMedia = await getTranslations('media');
  const params = searchParams ? await searchParams : {};
  const { page } = await parseSearchParams(params);
  const apiRequestService = getSSRApiRequestService();
  const response = await apiRequestService.reqChannelGetMany({ page });

  return (
    <>
      <Header title={tMedia("podcast.podcasts")} />
      <MainWrapper>
        <PodcastList
          ssrChannels={response?.data ?? []}
          ssrPage={page}
        />
      </MainWrapper>
    </>
  );
}

async function parseSearchParams(params: Record<string, string>) {
  const parsed = searchParamsSchema.safeParse(params);
  return {
    page: parsed.success && typeof parsed.data.page === "number" && !isNaN(parsed.data.page)
      ? parsed.data.page
      : 1
  };
}
import React from "react";
import { TakedownNoticeClient } from "./TakedownNoticeClient";
import { getSSRAuthService } from "../../../utils/auth/ssrAuth";

type TakedownNoticePageProps = {
  params: Promise<{ podcast_index_id: string }>;
};

export default async function TakedownNoticePage({ params }: TakedownNoticePageProps) {
  const { podcast_index_id } = await params;
  const { ssrApiRequestService } = await getSSRAuthService();
  const ssrFeed = await ssrApiRequestService.reqFeedGetByPodcastIndexId(podcast_index_id);
  return <TakedownNoticeClient ssrFeed={ssrFeed} />;
}

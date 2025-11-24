import React from "react";
import { apiRequestService } from "../../../factories/apiRequestService";
import { TakedownNoticeClient } from "./TakedownNoticeClient";

type TakedownNoticePageProps = {
  params: Promise<{ podcast_index_id: string }>;
};

export default async function TakedownNotice({ params }: TakedownNoticePageProps) {
  const { podcast_index_id } = await params;
  const ssrFeed = await apiRequestService.reqFeedGetByPodcastIndexId(podcast_index_id);
  return <TakedownNoticeClient ssrFeed={ssrFeed} />;
}

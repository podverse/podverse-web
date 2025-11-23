import React from "react";
import { apiRequestService } from "../../../factories/apiRequestService";
import TakedownNoticeClient from "./TakedownNoticeClient";

export default async function TakedownNotice({ params }: {
  params: { podcast_index_id: string }
}) {
  const { podcast_index_id } = params;
  const ssrFeed = await apiRequestService.reqFeedGetByPodcastIndexId(podcast_index_id);

  return (
    <TakedownNoticeClient ssrFeed={ssrFeed} />
  );
}

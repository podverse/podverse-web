import React from "react";
import { PodcastIndexFeedClient } from "./PodcastIndexFeedClient";
import { apiRequestService } from "../../../../factories/apiRequestService";

export default async function PodcastIndexFeed({ params }: { params: { podcast_index_id: string } }) {
  const podcastIndexResponse = await apiRequestService.reqPodcastIndexFeedById(params.podcast_index_id);

  const ssrFeed = podcastIndexResponse.feed;

  return (
    <PodcastIndexFeedClient ssrFeed={ssrFeed} />
  );
}

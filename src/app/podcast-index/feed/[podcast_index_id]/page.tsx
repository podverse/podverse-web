import { notFound } from "next/navigation";
import React from "react";
import { PodcastIndexFeedClient } from "./PodcastIndexFeedClient";
import { apiRequestService } from "../../../../factories/apiRequestService";
import { redirectToChannelPageByMediumServer } from "../../../../utils/redirect/redirectToChannelPageByMedium";

export default async function PodcastIndexFeedPage(props: { params: Promise<{ podcast_index_id: string }> }) {
  const { podcast_index_id } = await props.params;
  const podcastIndexResponse = await apiRequestService.reqPodcastIndexFeedById(podcast_index_id);

  const ssrFeed = podcastIndexResponse.feed;

  if (!ssrFeed) {
    return notFound();
  }

  // Always returns 200, even if not found, to avoid NEXT SSR error log
  const ssrChannel = await apiRequestService.reqChannelGetByPodcastIndexId(podcast_index_id);

  if (ssrChannel?.medium_id) {
    redirectToChannelPageByMediumServer(ssrChannel.medium_id, ssrChannel.id_text);
  }

  return (
    <PodcastIndexFeedClient ssrFeed={ssrFeed} />
  );
}

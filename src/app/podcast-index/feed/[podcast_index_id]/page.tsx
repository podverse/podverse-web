import React from "react";
import { PodcastIndexFeedClient } from "./PodcastIndexFeedClient";
import { apiRequestService } from "../../../../factories/apiRequestService";
import { notFound, redirect } from "next/navigation";
import { DTOChannel, MediumEnum } from "podverse-helpers";

export default async function PodcastIndexFeedPage(props: { params: Promise<{ podcast_index_id: string }> }) {
  const { podcast_index_id } = await props.params;
  const podcastIndexResponse = await apiRequestService.reqPodcastIndexFeedById(podcast_index_id);

  const ssrFeed = podcastIndexResponse.feed;

  if (!ssrFeed) {
    return notFound();
  }

  let redirectPath: string | null = null;
  let ssrChannel: DTOChannel | null = null;
  try {
    // Always returns 200, even if not found, to avoid NEXT SSR error log
    ssrChannel = await apiRequestService.reqChannelGetByPodcastIndexId(podcast_index_id);
  } catch (error) {
    // If the channel is not found, we can ignore the error
  }

  if (ssrChannel) {
    const medium_id = ssrChannel.medium_id;
    if (medium_id === MediumEnum.Podcast) {
      redirectPath = `/podcast/${ssrChannel.id_text}`;
    } else if (medium_id === MediumEnum.Video) {
      redirectPath = `/video/${ssrChannel.id_text}`;
    } else if (medium_id === MediumEnum.Music) {
      redirectPath = `/music/${ssrChannel.id_text}`;
    } else {
      console.log("No redirect: medium_id did not match Podcast, Video, or Music.");
    }
  }

  if (redirectPath) {
    redirect(redirectPath);
  }

  return (
    <PodcastIndexFeedClient ssrFeed={ssrFeed} />
  );
}

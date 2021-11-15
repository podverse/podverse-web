import { Podcast } from "podverse-shared"

export const getPodcastShrunkImageUrl = (podcast: Podcast) => podcast.shrunkImageUrl
  ? podcast.shrunkImageUrl
  : podcast.imageUrl
    ? podcast.imageUrl
    : '/images/podcast-solid-font-awesome-gray.svg'

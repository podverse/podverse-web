"use client";

import { MediaPlayerControllerLiveStreamVideo } from "./MediaPlayerControllerLiveStreamVideo";
import { MediaPlayerLivestreamVideoPortalFloating } from "./MediaPlayerLivestreamVideoPortalFloating";

export function MediaPlayerLiveStreamVideoWrapper() {
  return (
    <MediaPlayerLivestreamVideoPortalFloating>
      <MediaPlayerControllerLiveStreamVideo />
    </MediaPlayerLivestreamVideoPortalFloating>
  );
}

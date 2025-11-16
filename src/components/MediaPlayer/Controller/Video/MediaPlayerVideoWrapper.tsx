"use client";

import { getSelectedLabeledItemEnclosureAndSource } from "podverse-helpers";
import { useMediaPlayer } from "../../../../contexts/MediaPlayer";
import { useMediaPlayerVideo } from "../../../../contexts/MediaPlayerVideo";
import { MediaPlayerControllerVideo } from "./MediaPlayerControllerVideo";
import { MediaPlayerVideoPortalFloating } from "./MediaPlayerVideoPortalFloating";

export function MediaPlayerVideoWrapper() {
  const { videoLocation } = useMediaPlayerVideo();
  const { mpItem, mpItemLabeledItemEnclosures, mpEnclosureSelectedParams } = useMediaPlayer();

  if (!mpItem || mpItem.live_item) {
    return null
  };

  const selectedItemEnclosureAndSource = getSelectedLabeledItemEnclosureAndSource({
    labeledItemEnclosures: mpItemLabeledItemEnclosures,
    type: mpEnclosureSelectedParams.type,
    enclosureRowIndex: mpEnclosureSelectedParams.enclosureRowSelected,
    sourceRowIndex: mpEnclosureSelectedParams.sourceRowSelected
  })

  const isVideoFile = selectedItemEnclosureAndSource.labeledItemEnclosure?.mediaType === "video";
  const isLiveItem = !!mpItem?.live_item;

  if (isVideoFile && !isLiveItem) {
    if (videoLocation === "floating") {
      return (
        <MediaPlayerVideoPortalFloating>
          <MediaPlayerControllerVideo />
        </MediaPlayerVideoPortalFloating>
      );
    }
  }
  
  return null;
}
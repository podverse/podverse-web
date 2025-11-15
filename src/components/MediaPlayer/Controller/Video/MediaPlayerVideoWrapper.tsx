import { getMediaTypeFromSource, getSelectedItemEnclosureUrl } from "podverse-helpers";
import { useMediaPlayer } from "../../../../contexts/MediaPlayer";
import { useMediaPlayerVideo } from "../../../../contexts/MediaPlayerVideo";
import { MediaPlayerControllerVideo } from "./MediaPlayerControllerVideo";
import { MediaPlayerVideoPortalFloating } from "./MediaPlayerVideoPortalFloating";

export function MediaPlayerVideoWrapper() {
  const { videoLocation } = useMediaPlayerVideo();
  const { mpItem } = useMediaPlayer();

  if (!mpItem) {
    return null
  };

  // handle selected enclosure changes
  const selectedItemEnclosureUrl = getSelectedItemEnclosureUrl(mpItem?.item_enclosures ?? []);
  const isVideoFile = selectedItemEnclosureUrl && getMediaTypeFromSource(selectedItemEnclosureUrl) === "video";
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
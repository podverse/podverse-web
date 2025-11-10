import { getMediaTypeFromSource, getSelectedItemEnclosureUrl } from "podverse-helpers";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { MediaPlayerControllerLiveStreamVideo } from "../Controller/LiveStream/MediaPlayerControllerLiveStreamVideo";
import { MediaPlayerLivestreamVideoPortalFloating } from "../Controller/LiveStream/MediaPlayerLivestreamVideoPortalFloating";

export function MediaPlayerLiveStreamVideoWrapper() {
  const { mpItem } = useMediaPlayer();

  if (!mpItem || !mpItem.live_item) {
    return null;
  }

  const selectedItemEnclosureUrl = getSelectedItemEnclosureUrl(mpItem?.item_enclosures ?? []);
  const isVideoFile = selectedItemEnclosureUrl && getMediaTypeFromSource(selectedItemEnclosureUrl) === "video";
  const isLiveItem = !!mpItem?.live_item;

  return (
    <MediaPlayerLivestreamVideoPortalFloating>
      <MediaPlayerControllerLiveStreamVideo />
    </MediaPlayerLivestreamVideoPortalFloating>
  );
}

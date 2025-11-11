// import { getSelectedItemEnclosureUrl } from "podverse-helpers";
import { MediaPlayerControllerLiveStreamVideo } from "./MediaPlayerControllerLiveStreamVideo";
import { MediaPlayerLivestreamVideoPortalFloating } from "./MediaPlayerLivestreamVideoPortalFloating";
// import { checkIfIsVideoFile, checkIsLiveItem } from "../../../../utils/mediaPlayer/mediaPlayerItemEnclosureType";

export function MediaPlayerLiveStreamVideoWrapper() {
  // const selectedItemEnclosureUrl = getSelectedItemEnclosureUrl(mpItem?.item_enclosures ?? []);
  // const isVideoFile = checkIfIsVideoFile(selectedItemEnclosureUrl);
  // const isLiveItem = checkIsLiveItem(mpItem);

  return (
    <MediaPlayerLivestreamVideoPortalFloating>
      <MediaPlayerControllerLiveStreamVideo />
    </MediaPlayerLivestreamVideoPortalFloating>
  );
}

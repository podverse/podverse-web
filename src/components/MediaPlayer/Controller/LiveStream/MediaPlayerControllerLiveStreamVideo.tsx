import { useMediaPlayer } from "../../../../contexts/MediaPlayer";
import { MediaPlayerControllerLiveStreamAV } from "../MediaPlayerControllerLiveStreamAV";

export function MediaPlayerControllerLiveStreamVideo() {
  const { mpItem, mpItemLabeledItemEnclosures, mpEnclosureSelectedParams,
    mpIsPlaying } = useMediaPlayer();
  
  return (
    <MediaPlayerControllerLiveStreamAV
      mediaType="video"
      mpItem={mpItem}
      mpItemLabeledEnclosures={mpItemLabeledItemEnclosures}
      mpEnclosureSelectedParams={mpEnclosureSelectedParams}
      mpIsPlaying={mpIsPlaying}
      hidden={false}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

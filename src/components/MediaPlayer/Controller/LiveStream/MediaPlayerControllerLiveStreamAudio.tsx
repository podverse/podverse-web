import { MediaPlayerControllerLiveStreamAV } from "../MediaPlayerControllerLiveStreamAV";
import { useMediaPlayer } from "../../../../contexts/MediaPlayer";

export function MediaPlayerControllerLiveStreamAudio() {
  const { mpItem, mpItemLabeledItemEnclosures, mpEnclosureSelectedParams,
    mpIsPlaying } = useMediaPlayer();
  
  return (
    <MediaPlayerControllerLiveStreamAV
      mediaType="audio"
      mpItem={mpItem}
      mpItemLabeledEnclosures={mpItemLabeledItemEnclosures}
      mpEnclosureSelectedParams={mpEnclosureSelectedParams}
      mpIsPlaying={mpIsPlaying}
      hidden={true}
      style={{ display: "none" }}
    />
  );
}

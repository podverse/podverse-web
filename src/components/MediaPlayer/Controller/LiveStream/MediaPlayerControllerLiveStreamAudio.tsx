import { MediaPlayerControllerLiveStreamAV } from "../MediaPlayerControllerLiveStreamAV";
import { useMediaPlayer } from "../../../../contexts/MediaPlayer";

export function MediaPlayerControllerLiveStreamAudio() {
  const { mpItem } = useMediaPlayer();
  if (!mpItem?.live_item) {
    return null;
  }
  return (
    <MediaPlayerControllerLiveStreamAV
      mediaType="audio"
      mpItem={mpItem}
      hidden={true}
      style={{ display: "none" }}
    />
  );
}

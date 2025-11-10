import { useMediaPlayer } from "../../../../contexts/MediaPlayer";
import { MediaPlayerControllerLiveStreamAV } from "../MediaPlayerControllerLiveStreamAV";
export function MediaPlayerControllerLiveStreamVideo() {
  const { mpItem } = useMediaPlayer();
  if (!mpItem?.live_item) {
    return null;
  }
  return (
    <MediaPlayerControllerLiveStreamAV
      mediaType="video"
      mpItem={mpItem}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

import { useMediaPlayer } from "../../../../contexts/MediaPlayer";
import { MediaPlayerControllerLiveStreamAV } from "../MediaPlayerControllerLiveStreamAV";

export function MediaPlayerControllerLiveStreamVideo() {
  const { mpItem, mpIsPlaying } = useMediaPlayer();
  
  return (
    <MediaPlayerControllerLiveStreamAV
      mediaType="video"
      mpItem={mpItem}
      mpIsPlaying={mpIsPlaying}
      hidden={false}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

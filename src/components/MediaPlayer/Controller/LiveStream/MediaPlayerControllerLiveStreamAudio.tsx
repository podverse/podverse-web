import { MediaPlayerControllerLiveStreamAV } from "../MediaPlayerControllerLiveStreamAV";
import { useMediaPlayer } from "../../../../contexts/MediaPlayer";

export function MediaPlayerControllerLiveStreamAudio() {
  const { mpItem, mpIsPlaying } = useMediaPlayer();
  
  return (
    <MediaPlayerControllerLiveStreamAV
      mediaType="audio"
      mpItem={mpItem}
      mpIsPlaying={mpIsPlaying}
      hidden={true}
      style={{ display: "none" }}
    />
  );
}

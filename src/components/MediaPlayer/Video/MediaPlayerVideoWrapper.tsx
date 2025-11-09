import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { useMediaPlayerVideo } from "../../../contexts/MediaPlayerVideo";
import { MediaPlayerControllerVideo } from "../Controller/MediaPlayerControllerVideo";
import { MediaPlayerVideoPortalFloating } from "./MediaPlayerVideoPortalFloating";

export function MediaPlayerVideoWrapper() {
  const { videoLocation } = useMediaPlayerVideo();
  const { mpItem } = useMediaPlayer();

  if (!mpItem) {
    return null
  };

  if (videoLocation === "floating") {
    return (
      <MediaPlayerVideoPortalFloating>
        <MediaPlayerControllerVideo />
      </MediaPlayerVideoPortalFloating>
    );
  }
  
  return null;
}
import { FaForwardStep } from "react-icons/fa6"
import { useQueueResourcesLoadActive } from "../../../hooks/useQueueResourcesLoadActive";
import { useQueueResourcesMoveNowPlayingToHistory } from "../../../hooks/useQueueResourceMoveNowPlayingToHistory";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Buttons/TrackNextButton.module.scss"

export const TrackNextButton = () => {
  const { mpItem, mpClip, mpItemSoundbite, setMPShouldPlay, mpIsPlaying } = useMediaPlayer();
  const moveNowPlayingToHistory = useQueueResourcesMoveNowPlayingToHistory();
  const queueResourcesLoadActive = useQueueResourcesLoadActive();

  const onClick = async () => {
    await moveNowPlayingToHistory({
      mpClip: mpClip,
      mpItem: mpItem,
      mpItemSoundbite: mpItemSoundbite
    });
    setMPShouldPlay(mpIsPlaying);
    await queueResourcesLoadActive();
  }

  return (
    <button
      className={styles.trackNextButton}
      onClick={onClick}
      type="button">
      <FaForwardStep />
    </button>
  )
}

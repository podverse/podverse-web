import { useEffect, useRef } from "react";
import { FaForwardStep } from "react-icons/fa6"
import { useQueueResourcesLoadActive } from "../../../hooks/useQueueResourcesLoadActive";
import { useQueueResourcesMoveNowPlayingToHistory } from "../../../hooks/useQueueResourceMoveNowPlayingToHistory";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Buttons/TrackNextButtonMobile.module.scss"

export const TrackNextButtonMobile = () => {
  const { mpItem, setMPShouldPlay } = useMediaPlayer();
  const moveNowPlayingToHistory = useQueueResourcesMoveNowPlayingToHistory();
  const queueResourcesLoadActive = useQueueResourcesLoadActive();

  const mpItemRef = useRef(mpItem);

  useEffect(() => {
    mpItemRef.current = mpItem;
  }, [mpItem]);

  const onClick = async () => {
    await moveNowPlayingToHistory({
      mpClip: null,
      mpItem: mpItemRef.current,
      mpItemSoundbite: null
    });
    setMPShouldPlay(true);
    await queueResourcesLoadActive();
  }

  return (
    <button
      className={styles.trackNextButtonMobile}
      onClick={onClick}
      type="button">
      <FaForwardStep />
    </button>
  )
}

import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6"
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Buttons/MuteButton.module.scss";

export const MuteButton = () => {
  const { mpIsMuted, setMPIsMuted } = useMediaPlayer();
  const button = mpIsMuted ? <FaVolumeXmark /> : <FaVolumeHigh />;

  return (
    <button
      className={styles.muteButton}
      onClick={() => setMPIsMuted(!mpIsMuted)}>
      {button}
    </button>
  )
}

import { FaPause, FaPlay } from "react-icons/fa6"
import styles from "../../../styles/components/MediaPlayer/Buttons/PlayButtonMobile.module.scss"
import { useMediaPlayer } from "../../../contexts/MediaPlayer"

export const PlayButtonMobile = () => {
  const { mpIsPlaying, setMPIsPlaying } = useMediaPlayer();
  const icon = mpIsPlaying ? <FaPause /> : <FaPlay />;

  const handleClick = () => {
    setMPIsPlaying(!mpIsPlaying);
  };

  return (
    <button
      className={styles.playButtonMobile}
      onClick={handleClick}
      type="button">
      {icon}
    </button>
  )
}

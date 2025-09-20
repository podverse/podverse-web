import { FaPause, FaPlay } from "react-icons/fa6"
import styles from "../../../styles/components/MediaPlayer/Buttons/PlayButton.module.scss"
import { useMediaPlayer } from "../../../contexts/MediaPlayer"

export const PlayButton = () => {
  const { mpIsPlaying, setMPIsPlaying } = useMediaPlayer();
  const icon = mpIsPlaying ? <FaPause /> : <FaPlay />;

  const handleClick = () => {
    setMPIsPlaying(!mpIsPlaying);
  };

  return (
    <button
      className={styles.playButton}
      onClick={handleClick}>
      {icon}
    </button>
  )
}

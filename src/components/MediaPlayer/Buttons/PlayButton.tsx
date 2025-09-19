import { FaPlay } from "react-icons/fa6"
import styles from "../../../styles/components/MediaPlayer/Buttons/PlayButton.module.scss"

export const PlayButton = () => {
  return (
    <button className={styles.playButton}><FaPlay /></button>
  )
}

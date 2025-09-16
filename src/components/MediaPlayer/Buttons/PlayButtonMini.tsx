import { FaPlay } from "react-icons/fa"
import styles from "../../../styles/components/MediaPlayer/Buttons/PlayButtonMini.module.scss"

export const PlayButtonMini = () => {
  return (
    <button className={styles.playButtonMini}><FaPlay /></button>
  )
}

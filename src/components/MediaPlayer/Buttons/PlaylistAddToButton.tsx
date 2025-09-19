import { FaPlus } from "react-icons/fa6"
import styles from "../../../styles/components/MediaPlayer/Buttons/PlaylistAddToButton.module.scss"

export const PlaylistAddToButton = () => {
  return (
    <button className={styles.playlistAddToButton}><FaPlus /></button>
  )
}

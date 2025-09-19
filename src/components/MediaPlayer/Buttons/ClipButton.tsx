import { FaScissors } from "react-icons/fa6"
import styles from "../../../styles/components/MediaPlayer/Buttons/ClipButton.module.scss"

export const ClipButton = () => {
  return (
    <button className={styles.clipButton}><FaScissors /></button>
  )
}

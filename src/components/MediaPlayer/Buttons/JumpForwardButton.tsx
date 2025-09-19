import { FaRotateRight } from "react-icons/fa6"
import styles from "../../../styles/components/MediaPlayer/Buttons/JumpForwardButton.module.scss"

export const JumpForwardButton = () => {
  return (
    <button className={styles.jumpForwardButton}><FaRotateRight /></button>
  )
}

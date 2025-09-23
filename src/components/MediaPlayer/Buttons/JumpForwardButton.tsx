import { FaRotateRight } from "react-icons/fa6"
import { EVENTS } from "../../../constants/events"
import styles from "../../../styles/components/MediaPlayer/Buttons/JumpForwardButton.module.scss"

export const JumpForwardButton = () => {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.AUDIO.JUMP_FORWARD, { detail: { seconds: 30 } }))
  }
  
  return (
    <button
      className={styles.jumpForwardButton}
      onClick={handleClick}
      type="button">
      <FaRotateRight />
    </button>
  )
}

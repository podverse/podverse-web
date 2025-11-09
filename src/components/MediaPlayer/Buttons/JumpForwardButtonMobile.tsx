import { FaRotateRight } from "react-icons/fa6"
import { EVENTS } from "../../../constants/events"
import styles from "../../../styles/components/MediaPlayer/Buttons/JumpForwardButtonMobile.module.scss"

export const JumpForwardButtonMobile = () => {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.JUMP_FORWARD, { detail: { seconds: 30 } }))
  }
  
  return (
    <button
      className={styles.jumpForwardButtonMobile}
      onClick={handleClick}
      type="button">
      <FaRotateRight />
    </button>
  )
}

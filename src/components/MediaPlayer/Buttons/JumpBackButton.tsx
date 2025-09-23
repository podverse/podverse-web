import { EVENTS } from "../../../constants/events"
import styles from "../../../styles/components/MediaPlayer/Buttons/JumpBackButton.module.scss"
import { FaRotateLeft } from "react-icons/fa6"
import React from "react"

export const JumpBackButton = () => {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.AUDIO.JUMP_BACK, { detail: { seconds: 15 } }))
  }
  
  return (
    <button
      className={styles.jumpBackButton}
      onClick={handleClick}
      type="button">
      <FaRotateLeft />
    </button>
  )
}

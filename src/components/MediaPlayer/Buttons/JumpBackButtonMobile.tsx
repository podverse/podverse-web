import { EVENTS } from "../../../constants/events"
import styles from "../../../styles/components/MediaPlayer/Buttons/JumpBackButtonMobile.module.scss"
import { FaRotateLeft } from "react-icons/fa6"
import React from "react"

export const JumpBackButtonMobile = () => {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.JUMP_BACK, { detail: { seconds: 15 } }))
  }
  
  return (
    <button
      className={styles.jumpBackButtonMobile}
      onClick={handleClick}
      type="button">
      <FaRotateLeft />
    </button>
  )
}

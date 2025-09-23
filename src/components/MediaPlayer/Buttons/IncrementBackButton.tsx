import { FaChevronLeft } from "react-icons/fa6"
import React from "react"
import { EVENTS } from "../../../constants/events"
import styles from "../../../styles/components/MediaPlayer/Buttons/IncrementBackButton.module.scss"

export const IncrementBackButton = () => {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.AUDIO.JUMP_BACK, { detail: { seconds: 1 } }))
  }
  
  return (
    <button
      className={styles.incrementBackButton}
      onClick={handleClick}
      type="button">
      <FaChevronLeft />
    </button>
  )
}

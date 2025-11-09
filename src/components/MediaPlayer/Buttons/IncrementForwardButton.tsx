import { FaChevronRight } from "react-icons/fa6"
import React from "react"
import { EVENTS } from "../../../constants/events"
import styles from "../../../styles/components/MediaPlayer/Buttons/IncrementForwardButton.module.scss"

export const IncrementForwardButton = () => {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.JUMP_FORWARD, { detail: { seconds: 1 } }))
  }
  
  return (
    <button
      className={styles.incrementForwardButton}
      onClick={handleClick}
      type="button">
      <FaChevronRight />
    </button>
  )
}

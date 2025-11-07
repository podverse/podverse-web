import { FaAnglesLeft } from "react-icons/fa6"
import { EVENTS } from "../../../constants/events"
import styles from "../../../styles/components/MediaPlayer/Buttons/TrackPreviousButton.module.scss"

export const TrackPreviousButton = () => {
  const onClick = () => {
    window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.AUDIO.SEEK, { detail: { time: 0 } }))
  }

  return (
    <button
      className={styles.trackPreviousButton}
      onClick={onClick}
      type="button">
      <FaAnglesLeft />
    </button>
  )
}

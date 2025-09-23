import { FaAnglesLeft } from "react-icons/fa6"
import styles from "../../../styles/components/MediaPlayer/Buttons/TrackPreviousButton.module.scss"

export const TrackPreviousButton = () => {
  const onClick = () => {
    alert("Previous track functionality to be implemented")
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

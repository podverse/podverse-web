import { FaAnglesRight } from "react-icons/fa6"
import styles from "../../../styles/components/MediaPlayer/Buttons/TrackNextButton.module.scss"

export const TrackNextButton = () => {
  const onClick = () => {
    alert("Next track functionality to be implemented")
  }

  return (
    <button
      className={styles.trackNextButton}
      onClick={onClick}
      type="button">
      <FaAnglesRight />
    </button>
  )
}

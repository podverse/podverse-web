import { FaAnglesLeft } from "react-icons/fa6"
import styles from "../../../styles/components/MediaPlayer/Buttons/TrackPreviousButton.module.scss"

export const TrackPreviousButton = () => {
  return (
    <button className={styles.trackPreviousButton}><FaAnglesLeft /></button>
  )
}

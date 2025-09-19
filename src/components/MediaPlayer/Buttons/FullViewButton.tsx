import { FaUpRightAndDownLeftFromCenter } from "react-icons/fa6"
import styles from "../../../styles/components/MediaPlayer/Buttons/FullViewButton.module.scss"

export const FullViewButton = () => {
  return (
    <button className={styles.fullViewButton}><FaUpRightAndDownLeftFromCenter /></button>
  )
}

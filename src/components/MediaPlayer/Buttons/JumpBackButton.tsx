import styles from "../../../styles/components/MediaPlayer/Buttons/JumpBackButton.module.scss"
import { FaRotateLeft } from "react-icons/fa6"

export const JumpBackButton = () => {
  return (
    <button className={styles.jumpBackButton}><FaRotateLeft /></button>
  )
}

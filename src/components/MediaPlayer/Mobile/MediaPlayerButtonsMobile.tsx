"use client";

import { JumpBackButtonMobile } from "../Buttons/JumpBackButtonMobile";
import { JumpForwardButtonMobile } from "../Buttons/JumpForwardButtonMobile";
import { PlayButtonMobile } from "../Buttons/PlayButtonMobile";
import styles from "../../../styles/components/MediaPlayer/Mobile/MediaPlayerButtonsMobile.module.scss";

export const MediaPlayerButtonsMobile = () => {
  return (
    <div className={styles.buttons}>
      <JumpBackButtonMobile />
      <JumpForwardButtonMobile />
      <PlayButtonMobile />
    </div>
  )
}

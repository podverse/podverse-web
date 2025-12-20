"use client";

import { MediumEnum } from "podverse-helpers";
import { JumpBackButtonMobile } from "../Buttons/JumpBackButtonMobile";
import { JumpForwardButtonMobile } from "../Buttons/JumpForwardButtonMobile";
import { PlayButtonMobile } from "../Buttons/PlayButtonMobile";
import { SettingsButton } from "../Buttons/SettingsButton";
import { useQueues } from "../../../contexts/Queue";
import { TrackPreviousButtonMobile } from "../Buttons/TrackPreviousButtonMobile";
import { TrackNextButtonMobile } from "../Buttons/TrackNextButtonMobile";
import styles from "../../../styles/components/MediaPlayer/Mobile/MediaPlayerButtonsMobile.module.scss";

export const MediaPlayerButtonsMobile = () => {
  const { activeQueue } = useQueues();
  const medium_id = activeQueue?.medium_id || MediumEnum.AV;
  
  return (
    <div className={styles.buttons}>
      <SettingsButton />
      {
        medium_id === MediumEnum.AV && (
          <>
            <JumpBackButtonMobile />
            <JumpForwardButtonMobile />
          </>
        )
      }
      {
        medium_id === MediumEnum.Music && (
          <>
            <TrackPreviousButtonMobile />
            <TrackNextButtonMobile />
          </>
        )
      }
      <PlayButtonMobile />
    </div>
  )
}

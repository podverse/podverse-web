import { MediumEnum } from "podverse-helpers";
import { ClipButton } from "../Buttons/ClipButton";
import { PlaylistAddToButton } from "../Buttons/PlaylistAddToButton";
import { RepeatButton } from "../Buttons/RepeatButton";
import { ShuffleButton } from "../Buttons/ShuffleButton";
import { SettingsButton } from "../Buttons/SettingsButton";
import { useQueues } from "../../../contexts/Queue";
import styles from "../../../styles/components/MediaPlayer/Modal/MediaPlayerButtonsModal.module.scss";

export const MediaPlayerButtonsModal = () => {
  const { activeQueue } = useQueues();
  const medium_id = activeQueue?.medium_id || MediumEnum.AV;
  
  return (
    <div className={styles.buttons}>
      <div className={styles.startSection}>
        <PlaylistAddToButton />
        {
          medium_id === MediumEnum.AV && (
            <ClipButton />
          )
        }
        <RepeatButton />
        <ShuffleButton />
        <SettingsButton />
      </div>
    </div>
  )
}

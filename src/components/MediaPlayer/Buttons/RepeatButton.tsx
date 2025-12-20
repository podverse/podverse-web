import { FaRepeat } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { useAutoQueue } from "../../../contexts/AutoQueue";
import styles from "../../../styles/components/MediaPlayer/Buttons/RepeatButton.module.scss";

export const RepeatButton = () => {
  const tMediaPlayer = useTranslations("media_player");
  const { autoQueueConfig, setAutoQueueConfig } = useAutoQueue();

  const onClick = () => {
    setAutoQueueConfig({
      ...autoQueueConfig,
      repeat: !autoQueueConfig.repeat
    });
  };

  return (
    <button
      className={`${styles.repeatButton} ${autoQueueConfig.repeat ? styles.active : ''}`}
      onClick={onClick}
      type="button"
      aria-label={tMediaPlayer("repeat.toggle_repeat")}
      title={autoQueueConfig.repeat ? tMediaPlayer("repeat.repeat_enabled") : tMediaPlayer("repeat.repeat_disabled")}>
      <FaRepeat />
    </button>
  );
};

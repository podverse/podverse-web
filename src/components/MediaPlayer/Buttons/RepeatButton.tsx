import { FaRepeat } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { useAutoQueue } from "../../../contexts/AutoQueue";
import { useAutoQueueLoadResources } from "../../../hooks/useAutoQueueLoadResources";
import styles from "../../../styles/components/MediaPlayer/Buttons/RepeatButton.module.scss";

export const RepeatButton = () => {
  const tMediaPlayer = useTranslations("media_player");
  const { autoQueueConfig, setAutoQueueConfig, setAutoQueueResources,
    setAutoQueueActiveRow } = useAutoQueue();
  const autoQueueLoadResources = useAutoQueueLoadResources();

  const onClick = () => {
    setAutoQueueActiveRow(0);
    setAutoQueueResources({});
    setAutoQueueConfig({
      ...autoQueueConfig,
      repeat: !autoQueueConfig.repeat,
      nextPage: 1
    });
    setTimeout(() => {
      autoQueueLoadResources();
    }, 0);
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

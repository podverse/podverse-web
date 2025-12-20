import { FaShuffle } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { useAutoQueue } from "../../../contexts/AutoQueue";
import styles from "../../../styles/components/MediaPlayer/Buttons/ShuffleButton.module.scss";

export const ShuffleButton = () => {
  const tMediaPlayer = useTranslations("media_player");
  const { autoQueueConfig, setAutoQueueConfig } = useAutoQueue();

  const onClick = () => {
    setAutoQueueConfig({
      ...autoQueueConfig,
      random: !autoQueueConfig.random
    });
  };

  return (
    <button
      className={`${styles.shuffleButton} ${autoQueueConfig.random ? styles.active : ''}`}
      onClick={onClick}
      type="button"
      aria-label={tMediaPlayer("shuffle.toggle_shuffle")}
      title={autoQueueConfig.random ? tMediaPlayer("shuffle.shuffle_enabled") : tMediaPlayer("shuffle.shuffle_disabled")}>
      <FaShuffle />
    </button>
  );
};

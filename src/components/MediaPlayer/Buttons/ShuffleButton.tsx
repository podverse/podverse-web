import { FaShuffle } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { getShuffleHash } from "podverse-helpers";
import { useAutoQueue } from "../../../contexts/AutoQueue";
import { useAutoQueueLoadResources } from "../../../hooks/useAutoQueueLoadResources";
import styles from "../../../styles/components/MediaPlayer/Buttons/ShuffleButton.module.scss";

export const ShuffleButton = () => {
  const tMediaPlayer = useTranslations("media_player");
  const { autoQueueConfig, setAutoQueueConfig, setAutoQueueResources,
    setAutoQueueActiveRow } = useAutoQueue();
  const autoQueueLoadResources = useAutoQueueLoadResources();

  const onClick = () => {
    setAutoQueueActiveRow(0);
    setAutoQueueResources({});
    setAutoQueueConfig({
      ...autoQueueConfig,
      random: !autoQueueConfig.random,
      shuffleHash: getShuffleHash(),
      nextPage: 1
    });
    setTimeout(() => {
      autoQueueLoadResources();
    }, 0);
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

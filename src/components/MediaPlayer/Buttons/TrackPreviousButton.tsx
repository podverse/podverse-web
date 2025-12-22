import { FaBackwardStep } from "react-icons/fa6"
import { EVENTS } from "../../../constants/events"
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { MediumEnum } from "podverse-helpers/dist/lib/medium";
import { apiRequestService } from "../../../factories/apiRequestService";
import { useMediaPlayerResourceUpdate } from "../../../hooks/useMediaPlayerResourceUpdate";
import { getAutoQueueChannelMedium, useAutoQueue } from "../../../contexts/AutoQueue";
import { useMediaPlayerCurrentTime } from "../../../contexts/MediaPlayerCurrentTime";
import styles from "../../../styles/components/MediaPlayer/Buttons/TrackPreviousButton.module.scss"

export const TrackPreviousButton = () => {
  const { mpChannel, mpItem, setMPShouldPlay, mpIsPlaying } = useMediaPlayer();
  const { mpCurrentTime } = useMediaPlayerCurrentTime();

  const mediaPlayerResourceUpdate = useMediaPlayerResourceUpdate();
  const { autoQueueConfig, autoQueueActiveRow, setAutoQueueActiveRow } = useAutoQueue();
  
  const onClick = async () => {
    if (mpChannel && mpItem) {
      const isRestartThreshold = 3;
      const shouldRestart = mpCurrentTime > isRestartThreshold;

      if (shouldRestart) {
        window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.SEEK, { detail: { time: 0 } }));
        return;
      }

      if (autoQueueActiveRow > 0) {
        const previousAutoQueueActiveRow = autoQueueActiveRow - 1;
        setMPShouldPlay(mpIsPlaying);
        setAutoQueueActiveRow(previousAutoQueueActiveRow);
      } else {
        if (autoQueueConfig.random) {
          window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.SEEK, { detail: { time: 0 } }));
        } else {
          const autoQueueResourcesResponse = mpChannel?.medium_id === MediumEnum.Music
            ? await apiRequestService.reqItemGetManyForQueueBySeason(mpItem.id_text, "backward")
            : await apiRequestService.reqItemGetManyForQueueByPubDate(mpItem.id_text, "backward");
  
          const previousItem = autoQueueResourcesResponse.length > 0 ? autoQueueResourcesResponse[0] : null;
          
          if (previousItem) {
            mediaPlayerResourceUpdate({
              shouldPlay: mpIsPlaying,
              channel: previousItem.channel,
              clip: null,
              item: previousItem,
              itemChapter: null,
              itemChapterShouldSeek: false,
              itemSoundbite: null,
              enclosureSelectedParams: 'use-active-item-or-default',
              isPlaying: mpIsPlaying,
              skipMoveNowPlayingToHistory: false,
              newAutoQueueConfig: {
                aqmedium: getAutoQueueChannelMedium(previousItem.channel, autoQueueConfig.playlist_id_text),
                playlist_id_text: autoQueueConfig.playlist_id_text,
                disabled: false,
                random: autoQueueConfig.random,
                repeat: autoQueueConfig.repeat,
                nextPage: autoQueueConfig.nextPage || 1,
                shuffleHash: autoQueueConfig.shuffleHash
              },
              autoQueueShouldClear: true
            });
          } else {
            window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.SEEK, { detail: { time: 0 } }))
          }
        }
      }
    }
  }

  return (
    <button
      className={styles.trackPreviousButton}
      onClick={onClick}
      type="button">
      <FaBackwardStep />
    </button>
  )
}

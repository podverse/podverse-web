import { FaBackwardStep } from "react-icons/fa6"
import { useEffect, useRef } from "react";
import { EVENTS } from "../../../constants/events"
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { MediumEnum } from "podverse-helpers/dist/lib/medium";
import { apiRequestService } from "../../../factories/apiRequestService";
import { useMediaPlayerResourceUpdate } from "../../../hooks/useMediaPlayerResourceUpdate";
import { getAutoQueueChannelMedium, useAutoQueue } from "../../../contexts/AutoQueue";
import { useMediaPlayerCurrentTime } from "../../../contexts/MediaPlayerCurrentTime";
import styles from "../../../styles/components/MediaPlayer/Buttons/TrackPreviousButton.module.scss"

export const TrackPreviousButton = () => {
  const { mpChannel, mpItem } = useMediaPlayer();
  const { mpCurrentTime } = useMediaPlayerCurrentTime();

  const mediaPlayerResourceUpdate = useMediaPlayerResourceUpdate();
  const { autoQueueConfig } = useAutoQueue();

  const mpChannelRef = useRef(mpChannel);
  useEffect(() => {
    mpChannelRef.current = mpChannel;
  }, [mpChannel]);

  const mpItemRef = useRef(mpItem);
  useEffect(() => {
    mpItemRef.current = mpItem;
  }, [mpItem]);

  const mpCurrentTimeRef = useRef(mpCurrentTime);
  useEffect(() => {
    mpCurrentTimeRef.current = mpCurrentTime;
  }, [mpCurrentTime]);
  
  const onClick = async () => {
    if (mpChannelRef.current && mpItemRef.current) {
      const isRestartThreshold = 3;
      const shouldRestart = mpCurrentTimeRef.current > isRestartThreshold;

      if (shouldRestart) {
        window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.SEEK, { detail: { time: 0 } }));
        return;
      }

      const autoQueueResourcesResponse = mpChannel?.medium_id === MediumEnum.Music
        ? await apiRequestService.reqItemGetManyForQueueBySeason(mpItemRef.current.id_text, "backward")
        : await apiRequestService.reqItemGetManyForQueueByPubDate(mpItemRef.current.id_text, "backward");
      
      const previousItem = autoQueueResourcesResponse.length > 0 ? autoQueueResourcesResponse[0] : null;

      if (previousItem) {
        mediaPlayerResourceUpdate({
          shouldPlay: true,
          channel: previousItem.channel,
          clip: null,
          item: previousItem,
          itemChapter: null,
          itemChapterShouldSeek: false,
          itemSoundbite: null,
          enclosureSelectedParams: 'use-active-item-or-default',
          isPlaying: true,
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
          autoQueueShouldClear: false
        });
      } else {
        window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.SEEK, { detail: { time: 0 } }))
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

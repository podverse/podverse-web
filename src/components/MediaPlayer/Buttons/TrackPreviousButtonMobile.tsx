import { FaBackwardStep } from "react-icons/fa6"
import { DTOChannel, DTOClip, DTOItem, DTOItemSoundbite } from "podverse-helpers";
import { EVENTS } from "../../../constants/events"
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { MediumEnum } from "podverse-helpers/dist/lib/medium";
import { apiRequestService } from "../../../factories/apiRequestService";
import { useMediaPlayerResourceUpdate } from "../../../hooks/useMediaPlayerResourceUpdate";
import { useAutoQueue } from "../../../contexts/AutoQueue";
import { useMediaPlayerCurrentTime } from "../../../contexts/MediaPlayerCurrentTime";
import styles from "../../../styles/components/MediaPlayer/Buttons/TrackPreviousButtonMobile.module.scss"

export const TrackPreviousButtonMobile = () => {
  const { mpChannel, mpItem, mpClip, mpItemSoundbite, setMPShouldPlay, mpIsPlaying } = useMediaPlayer();
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
          let autoQueueResourcesResponse: any[] = [];
          let channel: DTOChannel | null = null;
          let clip: DTOClip | null = null;
          let item_soundbite: DTOItemSoundbite | null = null;
          let item: DTOItem | null = null;

          if (autoQueueConfig.playlist_id_text) {
            const response = await apiRequestService
              .reqPlaylistResourceGetManyForQueueByListPosition(
                autoQueueConfig.playlist_id_text,
                { clip_id_text: mpClip?.id_text, item_soundbite_id_text: mpItemSoundbite?.id_text, item_id_text: mpItem.id_text },
                "backward"
              );
            autoQueueResourcesResponse = response.data;
            const previousRow = autoQueueResourcesResponse.length > 0 ? autoQueueResourcesResponse[0] : null;
            if (previousRow) {
              if (previousRow.clip) {
                clip = previousRow.clip;
                item = previousRow.clip.item || null;
                channel = item?.channel || null;
              } else if (previousRow.item_soundbite) {
                item_soundbite = previousRow.item_soundbite;
                item = previousRow.item_soundbite.item || null;
                channel = item?.channel || null;
              } else if (previousRow.item) {
                item = previousRow.item;
                channel = previousRow.item.channel || null;
              }
            }
          } else {
            autoQueueResourcesResponse = mpChannel?.medium_id === MediumEnum.Music
              ? await apiRequestService.reqItemGetManyForQueueBySeason(mpItem.id_text, "backward")
              : await apiRequestService.reqItemGetManyForQueueByPubDate(mpItem.id_text, "backward");
            const previousItem = autoQueueResourcesResponse.length > 0 ? autoQueueResourcesResponse[0] : null;
            item = previousItem;
            channel = previousItem?.channel || null;
            clip = null;
            item_soundbite = null;
          }

          if (item) {
            mediaPlayerResourceUpdate({
              shouldPlay: mpIsPlaying,
              channel,
              clip,
              item,
              itemChapter: null,
              itemChapterShouldSeek: false,
              itemSoundbite: item_soundbite,
              enclosureSelectedParams: 'use-active-item-or-default',
              isPlaying: mpIsPlaying,
              skipMoveNowPlayingToHistory: false,
              newAutoQueueConfig: {
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
      className={styles.trackPreviousButtonMobile}
      onClick={onClick}
      type="button">
      <FaBackwardStep />
    </button>
  )
}

import { MediaPlayerControllerAV } from "../MediaPlayerControllerAV";
import { useMediaPlayer } from "../../../../contexts/MediaPlayer";
import { useMediaPlayerCurrentTime } from "../../../../contexts/MediaPlayerCurrentTime";
import { useQueueResourcesUpdateNowPlaying } from "../../../../hooks/useQueueResourceUpdateNowPlaying";
import { useQueueResourcesMoveNowPlayingToHistory } from "../../../../hooks/useQueueResourceMoveNowPlayingToHistory";
import { useQueueResourcesLoadActive } from "../../../../hooks/useQueueResourcesLoadActive";
import { useQueueResourcesAbridgedIndex } from "../../../../contexts/QueueResourcesAbridgedIndex";

export function MediaPlayerControllerAudio() {
  const mediaPlayer = useMediaPlayer();
  const { setMPCurrentTime } = useMediaPlayerCurrentTime();
  const updateNowPlaying = useQueueResourcesUpdateNowPlaying();
  const moveNowPlayingToHistory = useQueueResourcesMoveNowPlayingToHistory();
  const queueResourcesLoadActive = useQueueResourcesLoadActive();
  const { queueResourcesAbridgedIndex } = useQueueResourcesAbridgedIndex();

  return (
    <MediaPlayerControllerAV
      mediaType="audio"
      preload="auto"
      hidden={true}
      mpClip={mediaPlayer.mpClip}
      setMPClip={mediaPlayer.setMPClip}
      mpItem={mediaPlayer.mpItem}
      mpEnclosureSelectedParams={mediaPlayer.mpEnclosureSelectedParams}
      mpItemLabeledEnclosures={mediaPlayer.mpItemLabeledItemEnclosures}
      mpItemChapter={mediaPlayer.mpItemChapter}
      setMPItemChapter={mediaPlayer.setMPItemChapter}
      mpItemChapters={mediaPlayer.mpItemChapters}
      mpItemChapterShouldSeek={mediaPlayer.mpItemChapterShouldSeek}
      setMPItemChapterShouldSeek={mediaPlayer.setMPItemChapterShouldSeek}
      mpItemSoundbite={mediaPlayer.mpItemSoundbite}
      setMPItemSoundbite={mediaPlayer.setMPItemSoundbite}
      mpIsPlaying={mediaPlayer.mpIsPlaying}
      setMPIsPlaying={mediaPlayer.setMPIsPlaying}
      mpPlaybackSpeed={mediaPlayer.mpPlaybackSpeed}
      mpVolume={mediaPlayer.mpVolume}
      mpIsMuted={mediaPlayer.mpIsMuted}
      mpShouldPlay={mediaPlayer.mpShouldPlay}
      setMPShouldPlay={mediaPlayer.setMPShouldPlay}
      setMPDuration={mediaPlayer.setMPDuration}
      setMPCurrentTime={setMPCurrentTime}
      updateNowPlaying={updateNowPlaying}
      moveNowPlayingToHistory={moveNowPlayingToHistory}
      queueResourcesLoadActive={queueResourcesLoadActive}
      queueResourcesAbridgedIndex={queueResourcesAbridgedIndex}
    />
  );
}

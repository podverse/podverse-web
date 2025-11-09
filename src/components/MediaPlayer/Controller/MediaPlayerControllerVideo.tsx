import { MediaPlayerControllerAV } from "./MediaPlayerControllerAV";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { useMediaPlayerCurrentTime } from "../../../contexts/MediaPlayerCurrentTime";
import { useQueueResourcesUpdateNowPlaying } from "../../../hooks/useQueueResourceUpdateNowPlaying";
import { useQueueResourcesMoveNowPlayingToHistory } from "../../../hooks/useQueueResourceMoveNowPlayingToHistory";
import { useQueueResourcesLoadActive } from "../../../hooks/useQueueResourcesLoadActive";
import { useQueueResourcesAbridgedIndex } from "../../../contexts/QueueResourcesAbridgedIndex";

export function MediaPlayerControllerVideo() {
	const mediaPlayer = useMediaPlayer();
	const { setMPCurrentTime } = useMediaPlayerCurrentTime();
	const updateNowPlaying = useQueueResourcesUpdateNowPlaying();
	const moveNowPlayingToHistory = useQueueResourcesMoveNowPlayingToHistory();
	const queueResourcesLoadActive = useQueueResourcesLoadActive();
	const { queueResourcesAbridgedIndex } = useQueueResourcesAbridgedIndex();

	return (
		<MediaPlayerControllerAV
			mediaType="video"
			preload="auto"
			style={{ width: "100%", height: "100%" }}
			mpClip={mediaPlayer.mpClip}
			setMPClip={mediaPlayer.setMPClip}
			mpItem={mediaPlayer.mpItem}
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

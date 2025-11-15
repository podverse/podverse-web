import React, { useRef, useEffect, useMemo } from "react";
import { QueueResourcesAbridgedIndex, DTOClip, DTOItem, DTOItemChapter,
  DTOItemSoundbite, LabeledItemEnclosure,
  EnclosureSelectedParams,
  getSelectedLabeledItemEnclosureAndSource} from "podverse-helpers";
import { EVENTS } from "../../../constants/events";
import { MoveNowPlayingToHistoryCallbackParams } from "../../../hooks/useQueueResourceMoveNowPlayingToHistory";
import { UpdateNowPlayingParams } from "../../../hooks/useQueueResourceUpdateNowPlaying";
import { checkIfIsAudioFile, checkIfIsVideoFile, checkIsLiveItem } from "../../../utils/mediaPlayer/mediaPlayerItemEnclosureType";

export interface MediaPlayerControllerAVProps {
  mediaType: "audio" | "video";
  preload?: "auto" | "metadata" | "none";
  style?: React.CSSProperties;
  hidden?: boolean;
  mpClip: DTOClip | null;
  setMPClip: (clip: DTOClip | null) => void;
  mpItem: DTOItem | null;
  mpItemLabeledEnclosures: LabeledItemEnclosure[];
  mpEnclosureSelectedParams: EnclosureSelectedParams;
  mpItemChapter: DTOItemChapter | null;
  setMPItemChapter: (chapter: DTOItemChapter | null) => void;
  mpItemChapters: DTOItemChapter[] | null;
  mpItemChapterShouldSeek: boolean;
  setMPItemChapterShouldSeek: (seek: boolean) => void;
  mpItemSoundbite: DTOItemSoundbite | null;
  setMPItemSoundbite: (soundbite: DTOItemSoundbite | null) => void;
  mpIsPlaying: boolean;
  setMPIsPlaying: (playing: boolean) => void;
  mpPlaybackSpeed: number;
  mpVolume: number;
  mpIsMuted: boolean;
  mpShouldPlay: boolean;
  setMPShouldPlay: (shouldPlay: boolean) => void;
  setMPDuration: (duration: number) => void;
  setMPCurrentTime: (time: number) => void;
  updateNowPlaying: (args: UpdateNowPlayingParams) => void;
  moveNowPlayingToHistory: (params: MoveNowPlayingToHistoryCallbackParams) => Promise<void>;
  queueResourcesLoadActive: () => Promise<void>;
  queueResourcesAbridgedIndex: QueueResourcesAbridgedIndex;
}

let globalPauseAtTime: number | null = null;

export const MediaPlayerControllerAV: React.FC<MediaPlayerControllerAVProps> = (props) => {
  const {
    mediaType,
    preload = "auto",
    style,
    hidden,
    mpClip, setMPClip,
    mpItem,
    mpItemLabeledEnclosures,
    mpEnclosureSelectedParams,
    mpItemChapter, setMPItemChapter,
    mpItemChapters,
    mpItemChapterShouldSeek, setMPItemChapterShouldSeek,
    mpItemSoundbite, setMPItemSoundbite,
    mpIsPlaying, setMPIsPlaying,
    mpPlaybackSpeed,
    mpVolume,
    mpIsMuted,
    mpShouldPlay, setMPShouldPlay,
    setMPDuration,
    setMPCurrentTime,
    updateNowPlaying,
    moveNowPlayingToHistory,
    queueResourcesLoadActive,
    queueResourcesAbridgedIndex
  } = props;

  const mediaRef = useRef<HTMLAudioElement & HTMLVideoElement>(null);

  const mpClipRef = useRef<typeof mpClip>(null);
  useEffect(() => { mpClipRef.current = mpClip; }, [mpClip]);
  const mpItemRef = useRef<typeof mpItem>(null);
  useEffect(() => { mpItemRef.current = mpItem; }, [mpItem]);
  const mpItemSoundbiteRef = useRef<typeof mpItemSoundbite>(null);
  useEffect(() => { mpItemSoundbiteRef.current = mpItemSoundbite; }, [mpItemSoundbite]);
  const mpItemChapterRef = useRef<typeof mpItemChapter>(null);
  useEffect(() => { mpItemChapterRef.current = mpItemChapter; }, [mpItemChapter]);
  const mpItemChaptersRef = useRef<typeof mpItemChapters>(null);
  useEffect(() => { mpItemChaptersRef.current = mpItemChapters; }, [mpItemChapters]);
  const queueResourcesAbridgedIndexRef = useRef(queueResourcesAbridgedIndex);
  useEffect(() => { queueResourcesAbridgedIndexRef.current = queueResourcesAbridgedIndex; }, [queueResourcesAbridgedIndex]);

  const playbackElapsedRef = useRef(0);
  const lastPlaybackTimeRef = useRef<number | null>(null);
  
  const selectedItemEnclosureAndSource = useMemo(() =>
    getSelectedLabeledItemEnclosureAndSource({
      labeledItemEnclosures: mpItemLabeledEnclosures,
      type: mpEnclosureSelectedParams.type,
      enclosureRowIndex: mpEnclosureSelectedParams.enclosureRowSelected,
      sourceRowIndex: mpEnclosureSelectedParams.sourceRowSelected
    }),
    [mpItemLabeledEnclosures, mpEnclosureSelectedParams]
  );

  useEffect(() => {
    if (!selectedItemEnclosureAndSource.labeledItemEnclosure?.enclosure?.type) return;
    if (!selectedItemEnclosureAndSource.source?.uri) return;

    const media = mediaRef.current;
    const mpItem = mpItemRef.current;
    if (media && selectedItemEnclosureAndSource) {
      const isAudioFile = checkIfIsAudioFile(selectedItemEnclosureAndSource);
      const isVideoFile = checkIfIsVideoFile(selectedItemEnclosureAndSource);
      const isLiveItem = checkIsLiveItem(mpItem);
      if ((mediaType === "audio" ? isAudioFile : isVideoFile) && !isLiveItem) {
        media.currentTime = 0;
        media.load();
        if (mpShouldPlay) {
          media.play();
          setMPShouldPlay(false);
        }
      } else {
        media.pause();
        media.removeAttribute("src");
        media.load();
      }
    }
  }, [selectedItemEnclosureAndSource]);

  useEffect(() => {
    const handleSeek = (e: Event) => {
      const customEvent = e as CustomEvent<{ time: number }>;
      const media = mediaRef.current;
      if (media && typeof customEvent.detail.time === "number") {
        media.currentTime = customEvent.detail.time;
      }
    };

    const handleJumpBack = (e: Event) => {
      const customEvent = e as CustomEvent<{ seconds: number }>;
      const media = mediaRef.current;
      if (media && typeof customEvent.detail.seconds === "number") {
        media.currentTime = Math.max(media.currentTime - customEvent.detail.seconds, 0);
      }
    };

    const handleJumpForward = (e: Event) => {
      const customEvent = e as CustomEvent<{ seconds: number }>;
      const media = mediaRef.current;
      if (
        media &&
        typeof customEvent.detail.seconds === "number" &&
        typeof media.duration === "number"
      ) {
        media.currentTime = Math.min(
          media.currentTime + customEvent.detail.seconds,
          media.duration
        );
      }
    };

    const handlePauseAt = (e: Event) => {
      const customEvent = e as CustomEvent<{ stopAt: number }>;
      if (typeof customEvent.detail.stopAt === "number") {
        globalPauseAtTime = customEvent.detail.stopAt;
      }
    };

    window.addEventListener(EVENTS.MEDIA_PLAYER.SEEK, handleSeek);
    window.addEventListener(EVENTS.MEDIA_PLAYER.JUMP_BACK, handleJumpBack);
    window.addEventListener(EVENTS.MEDIA_PLAYER.JUMP_FORWARD, handleJumpForward);
    window.addEventListener(EVENTS.MEDIA_PLAYER.PAUSE_AT, handlePauseAt);

    return () => {
      window.removeEventListener(EVENTS.MEDIA_PLAYER.SEEK, handleSeek);
      window.removeEventListener(EVENTS.MEDIA_PLAYER.JUMP_BACK, handleJumpBack);
      window.removeEventListener(EVENTS.MEDIA_PLAYER.JUMP_FORWARD, handleJumpForward);
      window.removeEventListener(EVENTS.MEDIA_PLAYER.PAUSE_AT, handlePauseAt);
    };
  }, []);

  useEffect(() => {
    const media = mediaRef?.current;
    if (!media) return;

    const handleLoadedMetadata = () => {
      const newDuration = media.duration;
      const clip = mpClipRef.current;
      const itemSoundbite = mpItemSoundbiteRef.current;
      const item = mpItemRef.current;
      let newCurrentTime: number | null = null;

      if (mpClipRef.current) {
        newCurrentTime = Number(mpClipRef.current.start_time);
      } else if (mpItemSoundbiteRef.current) {
        newCurrentTime = Number(mpItemSoundbiteRef.current.start_time);
      } else if (mpItemChapterRef.current) {
        newCurrentTime = Number(mpItemChapterRef.current.start_time);
      } else if (mpItemRef.current) {
        const queueResourceAbridged = queueResourcesAbridgedIndexRef.current.items[mpItemRef.current.id];
        if (Number(queueResourceAbridged?.p) > 0) {
          newCurrentTime = Number(queueResourceAbridged?.p);
        } else {
          newCurrentTime = 0;
        }
      }

      if ((clip || itemSoundbite || item) && newCurrentTime !== null) {
        media.currentTime = newCurrentTime;
      }

      setMPDuration(newDuration);
      updateNowPlaying({
        mpClip: clip,
        mpItem: item,
        mpItemSoundbite: itemSoundbite,
        mpDuration: newDuration,
        mpCurrentTime: newCurrentTime !== null ? newCurrentTime : 0
      });
    };

    const handlePlay = () => {
      const newCurrentTime = media.currentTime;
      if (newCurrentTime < media.duration) {
        updateNowPlaying({
          mpClip: mpClipRef.current,
          mpItem: mpItemRef.current,
          mpItemSoundbite: mpItemSoundbiteRef.current,
          mpCurrentTime: newCurrentTime
        });
        playbackElapsedRef.current = 0;
        lastPlaybackTimeRef.current = newCurrentTime;
      }
    };

    const handlePause = () => {
      const newCurrentTime = media.currentTime;
      if (newCurrentTime < media.duration) {
        updateNowPlaying({
          mpClip: mpClipRef.current,
          mpItem: mpItemRef.current,
          mpItemSoundbite: mpItemSoundbiteRef.current,
          mpCurrentTime: newCurrentTime
        });
        playbackElapsedRef.current = 0;
        lastPlaybackTimeRef.current = null;
      }
    };

    const handleTimeUpdate = () => {
      const clip = mpClipRef.current;
      const item = mpItemRef.current;
      const itemSoundbite = mpItemSoundbiteRef.current;
      const chapters = mpItemChaptersRef.current;
      const newCurrentTime = media.currentTime;

      setMPCurrentTime(newCurrentTime);

      if (lastPlaybackTimeRef.current !== null) {
        const delta = newCurrentTime - lastPlaybackTimeRef.current;
        if (delta > 0) {
          playbackElapsedRef.current += delta;
        }
      }
      lastPlaybackTimeRef.current = newCurrentTime;

      if (playbackElapsedRef.current >= 15) {
        updateNowPlaying({
          mpClip: clip,
          mpItem: item,
          mpItemSoundbite: itemSoundbite,
          mpCurrentTime: newCurrentTime
        });
        playbackElapsedRef.current = 0;
      }

      if (globalPauseAtTime !== null && newCurrentTime >= globalPauseAtTime) {
        setMPIsPlaying(false);
        globalPauseAtTime = null;
      }

      if (clip && clip.end_time) {
        const endTimeNum = typeof clip.end_time === "string" ? parseFloat(clip.end_time) : clip.end_time;
        const endTimeNumAdjusted = endTimeNum + 1;
        if (!isNaN(endTimeNumAdjusted) && newCurrentTime >= endTimeNumAdjusted) {
          setMPClip(null);
          setMPIsPlaying(false);
          globalPauseAtTime = null;
        }
      }

      if (itemSoundbite && itemSoundbite.duration) {
        const startNum = typeof itemSoundbite.start_time === "string" ? parseFloat(itemSoundbite.start_time) : itemSoundbite.start_time;
        const durationNum = typeof itemSoundbite.duration === "string" ? parseFloat(itemSoundbite.duration) : itemSoundbite.duration;
        const endTimeNum = startNum + durationNum;
        const endTimeNumAdjusted = endTimeNum + 1;
        if (!isNaN(endTimeNumAdjusted) && newCurrentTime >= endTimeNumAdjusted) {
          setMPItemSoundbite(null);
          setMPIsPlaying(false);
          globalPauseAtTime = null;
        }
      }

      if (
        !itemSoundbite &&
        !clip &&
        Array.isArray(chapters) &&
        chapters.length > 0
      ) {
        const matchingChapters = chapters.filter(ch => {
          const start = typeof ch.start_time === "string" ? parseFloat(ch.start_time) : ch.start_time;
          const end = typeof ch.end_time === "string" ? parseFloat(ch.end_time) : ch.end_time;
          if (typeof end !== "number" || isNaN(end)) return false;
          return newCurrentTime >= start && newCurrentTime < end;
        });
        let selectedChapter = null;
        if (matchingChapters.length > 0) {
          selectedChapter = matchingChapters.find(ch => ch.table_of_contents === false) || matchingChapters[0];
        }
        if (selectedChapter && (!mpItemChapterRef.current || mpItemChapterRef.current.id !== selectedChapter.id)) {
          setMPItemChapter(selectedChapter);
        }
      }
    };

    const handleEnded = async () => {
      await moveNowPlayingToHistory({
        completed: true,
        mpClip: null,
        mpItem: mpItemRef.current,
        mpItemSoundbite: null
      });
      setMPShouldPlay(true);
      await queueResourcesLoadActive();
    };

    media.addEventListener("loadedmetadata", handleLoadedMetadata);
    media.addEventListener("play", handlePlay);
    media.addEventListener("pause", handlePause);
    media.addEventListener("timeupdate", handleTimeUpdate);
    media.addEventListener("ended", handleEnded);

    return () => {
      media.removeEventListener("loadedmetadata", handleLoadedMetadata);
      media.removeEventListener("play", handlePlay);
      media.removeEventListener("pause", handlePause);
      media.removeEventListener("timeupdate", handleTimeUpdate);
      media.removeEventListener("ended", handleEnded);
    };
  }, [mediaRef]);

  useEffect(() => {
    const media = mediaRef?.current;
    if (!media) return;
    if (mpIsPlaying) {
      media.play().catch(() => {});
      setMPShouldPlay(false);
    } else {
      media.pause();
    }
  }, [mpIsPlaying]);

  useEffect(() => {
    const media = mediaRef?.current;
    if (!media) return;
    media.volume = mpVolume;
  }, [mpVolume]);

  useEffect(() => {
    const media = mediaRef?.current;
    if (!media) return;
    media.muted = mpIsMuted;
  }, [mpIsMuted]);

  useEffect(() => {
    const media = mediaRef?.current;
    if (!media) return;
    media.playbackRate = mpPlaybackSpeed;
  }, [mpPlaybackSpeed]);

  useEffect(() => {
    if (mpClip && mediaRef.current) {
      const media = mediaRef.current;
      media.currentTime = Number(mpClip.start_time);
      if (mpShouldPlay) {
        media.play();
        setMPShouldPlay(false);
      }
      if (mpClip.end_time) {
        globalPauseAtTime = Number(mpClip.end_time);
      }
    }
    if (mpItemChapter && mediaRef.current) {
      if (mpItemChapterShouldSeek) {
        setMPItemChapterShouldSeek(false);
        const media = mediaRef.current;
        media.currentTime = Number(mpItemChapter.start_time);
        if (mpShouldPlay) {
          media.play();
          setMPShouldPlay(false);
        }
      }
      if (mpItemChapter.end_time) {
        globalPauseAtTime = null;
      }
    }
    if (mpItemSoundbite && mediaRef.current) {
      const media = mediaRef.current;
      media.currentTime = Number(mpItemSoundbite.start_time);
      if (mpShouldPlay) {
        media.play();
        setMPShouldPlay(false);
      }
      if (mpItemSoundbite.duration) {
        globalPauseAtTime = Number(mpItemSoundbite.start_time) + Number(mpItemSoundbite.duration);
      }
    }
  }, [mpClip, mpItemChapter, mpItemSoundbite]);

  if (mediaType === "audio") {
    return (
      <audio
        ref={mediaRef}
        src={selectedItemEnclosureUrl}
        preload={preload}
        style={hidden ? { display: "none" } : style}
      />
    );
  } else {
    return (
      <video
        ref={mediaRef}
        src={selectedItemEnclosureUrl}
        preload={preload}
        style={hidden ? { display: "none" } : style}
        controls={false}
      />
    );
  }
};

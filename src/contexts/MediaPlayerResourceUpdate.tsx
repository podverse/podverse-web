import { DTOChannel, DTOClip, DTOItem, DTOItemChapter, DTOItemSoundbite } from "podverse-helpers";
import { useMediaPlayer } from "./MediaPlayer";

export function useMediaPlayerResourceUpdate() {
  const {
    setMPShouldPlay,
    setMPChannel,
    setMPClip,
    setMPItem,
    setMPItemChapter,
    setMPItemChapterShouldSeek,
    setMPItemSoundbite,
    setMPIsPlaying,
  } = useMediaPlayer();

  return ({
    shouldPlay,
    channel,
    clip,
    item,
    itemChapter,
    itemChapterShouldSeek,
    itemSoundbite,
    isPlaying
  }: {
    shouldPlay?: boolean
    channel: DTOChannel | null,
    clip: DTOClip | null,
    item: DTOItem | null,
    itemChapter: DTOItemChapter | null,
    itemChapterShouldSeek: boolean,
    itemSoundbite: DTOItemSoundbite | null,
    isPlaying?: boolean,
  }) => {
    if (shouldPlay !== undefined) {
      setMPShouldPlay(shouldPlay);
    }
    setMPChannel(channel);
    setMPClip(clip);
    setMPItem(item);
    setMPItemChapter(itemChapter);
    setMPItemChapterShouldSeek(itemChapterShouldSeek);
    setMPItemSoundbite(itemSoundbite);
    if (isPlaying !== undefined) {
      setMPIsPlaying(isPlaying);
    }
  };
}

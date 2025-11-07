"use client";

import { useTranslations } from "next-intl";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Mobile/MediaPlayerMarqueeMobile.module.scss";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { getAdjacentChapter } from "../../../utils/itemChapter";

export const MediaPlayerMarqueeMobile = () => {
  const tMisc = useTranslations("misc");
  const { mpClip, mpItemChapter, mpItemChapters, mpItemSoundbite,
    setMPItemChapter, setMPItemChapterShouldSeek } = useMediaPlayer();

  if (!mpClip && !mpItemSoundbite && !mpItemChapter) {
    return null;
  }

  const title = mpClip?.title || mpItemSoundbite?.title || mpItemChapter?.title || tMisc("untitled");

  const showButtons = !mpClip && !mpItemSoundbite;

  const loadPreviousChapter = () => {
    if (mpItemChapter && mpItemChapters) {
      const previousChapter = getAdjacentChapter({
        currentChapter: mpItemChapter,
        chapters: mpItemChapters,
        direction: "previous",
      });
  
      if (previousChapter) {
        setMPItemChapter(previousChapter);
        setMPItemChapterShouldSeek(true);
      }
    }
  }

  const loadNextChapter = () => {
    if (mpItemChapter && mpItemChapters) {
      const nextChapter = getAdjacentChapter({
        currentChapter: mpItemChapter,
        chapters: mpItemChapters,
        direction: "next",
      });

      if (nextChapter) {
        setMPItemChapter(nextChapter);
        setMPItemChapterShouldSeek(true);
      }
    }
  }

  return (
    <div className={styles.marquee}>
      {
        showButtons && (
          <div className={styles.prevChapter}>
            <button
              className={styles.prevChapterButton}
              onClick={loadPreviousChapter}
              type="button">
              <FaArrowLeft />
            </button>
          </div>
        )
      }
      <div className={styles.marqueeText}>
        {title}
      </div>
      {
        showButtons && (
          <div className={styles.nextChapter}>
            <button
              className={styles.nextChapterButton}
              onClick={loadNextChapter}
              type="button">
              <FaArrowRight />
            </button>
          </div>
        )
      }
    </div>
  )
}

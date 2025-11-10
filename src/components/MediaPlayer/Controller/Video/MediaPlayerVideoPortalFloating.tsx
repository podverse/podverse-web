import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import { useMediaPlayer } from "../../../../contexts/MediaPlayer";
import styles from "../../../../styles/components/MediaPlayer/Controller/Video/MediaPlayerVideoPortalFloating.module.scss";

export const MediaPlayerVideoPortalFloating: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mpItemSoundbite, mpClip, mpItemChapter } = useMediaPlayer();
  const hasMarquee = !!mpItemSoundbite || !!mpClip || !!mpItemChapter; 

  return ReactDOM.createPortal(
    <div className={classNames({
      [styles.floatingVideoPortal]: true,
      [styles.hasMarquee]: hasMarquee
    })}>
      {children}
    </div>,
    document.body
  );
};
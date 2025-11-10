import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import styles from "../../../../styles/components/MediaPlayer/Controller/LiveStream/MediaPlayerLiveStreamVideoPortalFloating.module.scss";

export const MediaPlayerLivestreamVideoPortalFloating: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return ReactDOM.createPortal(
    <div className={classNames(styles.floatingVideoPortal)}>
      {children}
    </div>,
    document.body
  );
};

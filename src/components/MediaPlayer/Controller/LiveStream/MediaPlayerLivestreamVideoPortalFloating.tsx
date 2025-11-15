"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import { useMediaPlayer } from "../../../../contexts/MediaPlayer";
import styles from "../../../../styles/components/MediaPlayer/Controller/LiveStream/MediaPlayerLivestreamVideoPortalFloating.module.scss";
import { getSelectedLabeledItemEnclosureAndSource } from "podverse-helpers/dist/lib/item/itemEnclosure";

export const MediaPlayerLivestreamVideoPortalFloating: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { mpItemLabeledItemEnclosures, mpEnclosureSelectedParams, mpItemSoundbite,
    mpClip, mpItemChapter } = useMediaPlayer();
  const hasMarquee = !!mpItemSoundbite || !!mpClip || !!mpItemChapter;

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  const selectedItemEnclosureAndSource = getSelectedLabeledItemEnclosureAndSource({
      labeledItemEnclosures: mpItemLabeledItemEnclosures,
      type: mpEnclosureSelectedParams.type,
      enclosureRowIndex: mpEnclosureSelectedParams.enclosureRowSelected,
      sourceRowIndex: mpEnclosureSelectedParams.sourceRowSelected
    })

  let style = {};
  const labeled = selectedItemEnclosureAndSource.labeledItemEnclosure;
  if (!labeled || labeled?.mediaType !== "video") {
    style = { ...style, display: "none" };
  }

  return ReactDOM.createPortal(
    <div
      className={classNames({
        [styles.floatingVideoPortal]: true,
        [styles.hasMarquee]: hasMarquee,
      })}
      style={style}
    >
      {children}
    </div>,
    document.body
  );
};

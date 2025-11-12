import React, { useRef, useEffect } from "react";
import { DTOItem, getLiveItemEnclosureSource } from "podverse-helpers";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export interface MediaPlayerControllerLiveStreamAVProps {
  mediaType: "audio" | "video";
  mpItem: DTOItem | null;
  style?: React.CSSProperties;
  hidden: boolean;
  mpIsPlaying: boolean;
}

export const MediaPlayerControllerLiveStreamAV: React.FC<MediaPlayerControllerLiveStreamAVProps> = ({
  mediaType,
  mpItem,
  style,
  hidden,
  mpIsPlaying
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mediaElRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  const videoJsPlayerRef = useRef<any | null>(null);

  const enclosureResult = getLiveItemEnclosureSource(mpItem);

  // Recreate player whenever mpItem (or source) changes.
  useEffect(() => {
    if (!containerRef.current) return;

    const srcUrl = enclosureResult?.url;
    const srcType = enclosureResult?.type;
    if (!mpItem?.live_item || !srcUrl || !srcType) {
      // Dispose if currently showing something but new item invalid.
      if (videoJsPlayerRef.current && !videoJsPlayerRef.current.isDisposed()) {
        videoJsPlayerRef.current.dispose();
        videoJsPlayerRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        mediaElRef.current = null;
      }
      return;
    }

    // Dispose previous safely.
    if (videoJsPlayerRef.current && !videoJsPlayerRef.current.isDisposed()) {
      videoJsPlayerRef.current.dispose();
      videoJsPlayerRef.current = null;
    }

    // Clear container.
    containerRef.current.innerHTML = "";
    mediaElRef.current = null;

    console.log("mediaType", mediaType)

    // Create new media element (not controlled by React).
    const el =
      document.createElement(mediaType === "video" ? "video" : "audio");
    el.className = "video-js vjs-default-skin";
    el.style.width = "100%";
    el.setAttribute("playsinline", "");
    if (style) {
      Object.entries(style).forEach(([k, v]) => {
        // @ts-ignore
        el.style[k] = v as any;
      });
    }
    containerRef.current.appendChild(el);
    mediaElRef.current = el;

    // Init Video.js.
    videoJsPlayerRef.current = videojs(el, {
      controls: false,
      autoplay: true,
      preload: "auto",
      sources: [{ src: srcUrl, type: srcType }]
    });

    return () => {
      // Only dispose once.
      if (videoJsPlayerRef.current && !videoJsPlayerRef.current.isDisposed()) {
        try {
          videoJsPlayerRef.current.dispose();
        } catch {
          /* swallow removal race */
        }
        videoJsPlayerRef.current = null;
      }
    };
  }, [mpItem?.id, enclosureResult?.url, enclosureResult?.type, mediaType]);

  // Play / pause sync.
  useEffect(() => {
    const p = videoJsPlayerRef.current;
    if (!p || p.isDisposed()) return;
    if (mpIsPlaying) p.play();
    else p.pause();
  }, [mpIsPlaying]);

  const hiddenCommon =
    hidden ||
    !mpItem?.live_item ||
    !enclosureResult?.url ||
    (mediaType === "video"
      ? !enclosureResult?.isVideoHLS
      : !enclosureResult?.isAudioHLS);

  return (
    <div
      ref={containerRef}
      data-vjs-player
      hidden={hiddenCommon}
      style={style}
    />
  );
};

/*

NOTES:

Special disposed logic was added to avoid problems with this scenario:

step 1: load a livestream using video js
step 2: a new non-livestream loads with a different controller, and video js instance disposes
step 3: a new livestream using video js needs to load

the problem is that since the video js instance was disposed, the DOM no longer has the element needed

how to handle this situation? whenever mpItem changes, the video js needs to be disposed and recreated

*/

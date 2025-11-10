import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { DTOItem } from "podverse-helpers";

export interface MediaPlayerControllerLiveStreamAVProps {
	mediaType: "audio" | "video";
	mpItem: DTOItem;
	style?: React.CSSProperties;
	hidden?: boolean;
}

export const MediaPlayerControllerLiveStreamAV: React.FC<MediaPlayerControllerLiveStreamAVProps> = (props) => {
	const { mediaType, mpItem, style, hidden } = props;
	const playerRef = useRef<HTMLVideoElement & HTMLAudioElement>(null);
	const videoJsPlayerRef = useRef<any>(null);

	console.log("MediaPlayerControllerLiveStreamAV render", { mediaType, mpItem });

	if (!mpItem?.live_item) {
		return null;
	}

	const enclosureResult = getLiveItemEnclosureSource(mpItem);

	useEffect(() => {
		console.log("Initializing video.js player", { mediaType, enclosureResult });
		if (playerRef.current && enclosureResult.url) {
			// Dispose of existing player if it exists
			if (videoJsPlayerRef.current) {
				videoJsPlayerRef.current.dispose();
			}

			// Initialize video.js player
			videoJsPlayerRef.current = videojs(playerRef.current, {
				controls: true,
				autoplay: false,
				preload: "auto",
				sources: [
					{
						src: enclosureResult.url,
						type: enclosureResult.type
					}
				]
			});
		}

		return () => {
			if (videoJsPlayerRef.current) {
				videoJsPlayerRef.current.dispose();
				videoJsPlayerRef.current = null;
			}
		};
	}, [enclosureResult.url, enclosureResult.type]);

	console.log("isVideoHLS", enclosureResult.isVideoHLS, "isAudioHLS", enclosureResult.isAudioHLS);

	if (mediaType === "video" && enclosureResult.isVideoHLS && enclosureResult.url) {
		return (
			<video
				ref={playerRef}
				className="video-js vjs-default-skin"
				style={style}
				hidden={hidden}
			/>
		);
	}
	if (mediaType === "audio" && enclosureResult.isAudioHLS && enclosureResult.url) {
		return (
			<audio
				ref={playerRef}
				className="video-js vjs-default-skin"
				style={style}
				hidden={hidden}
			/>
		);
	}
	return null;
};

function getLiveItemEnclosureSource(item: DTOItem): {
	url: string | null,
	type: string,
	isAudioHLS: boolean,
	isVideoHLS: boolean
} {
	const enclosures = item?.item_enclosures || [];
	const defaultEnclosure = enclosures.find((e: any) => e.item_enclosure_default) || enclosures[0];
	const source = defaultEnclosure?.item_enclosure_sources?.[0];
	if (!source?.uri) return { url: null, type: "", isAudioHLS: false, isVideoHLS: false };
	// Detect HLS by .m3u8 extension
	if (source.uri.endsWith(".m3u8")) {
		// Try to distinguish audio-only HLS from video HLS
		const enclosureType = defaultEnclosure?.type || source?.content_type || "";
		const codecs = defaultEnclosure?.codecs || "";
		// If type or codecs indicate audio, treat as audio HLS
		const isAudioHLS =
			(typeof enclosureType === "string" && enclosureType.includes("audio")) ||
			(typeof codecs === "string" && !!codecs.match(/mp4a|aac|opus|vorbis|flac|alac|pcm/i));
		return {
			url: source.uri,
			type: "application/x-mpegURL",
			isAudioHLS,
			isVideoHLS: !isAudioHLS
		};
	}
	// Fallback to enclosure type or content_type
	const enclosureType = defaultEnclosure?.type || source?.content_type || "audio";
	if (typeof enclosureType === "string" && enclosureType.includes("video")) {
		return { url: source.uri, type: "video/mp4", isAudioHLS: false, isVideoHLS: true };
	}
	if (typeof enclosureType === "string" && enclosureType.includes("audio")) {
		return { url: source.uri, type: "audio/mpeg", isAudioHLS: true, isVideoHLS: false };
	}
	// Fallback to audio/mpeg
	return { url: source.uri, type: "audio/mpeg", isAudioHLS: true, isVideoHLS: false };
}

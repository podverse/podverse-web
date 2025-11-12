import { LabeledItemEnclosure } from "podverse-helpers";
import { useTranslations } from "next-intl";

// Hook-style helper that returns a translated label for a selected enclosure.
// Result rules:
//  - Audio w/ bitrate => "Audio: <number>kbps" or "Audio: <number>Mbps"
//  - Audio w/o bitrate => "Audio"
//  - Video w/ height => "Video: <height>p"
//  - Video w/o height => "Video"
export function useEnclosureLabel(selectedEnclosure?: LabeledItemEnclosure) {
	const tMediaPlayer = useTranslations('media_player');

	if (!selectedEnclosure) return undefined;

	if (selectedEnclosure.mediaType === 'audio') {
		const bitrate = selectedEnclosure.audioBitrate;
		const ext = selectedEnclosure.fileExtension;

		if (bitrate) {
			const { value, unit } = bitrate;
			if (ext) {
				// Audio with extension and bitrate
				if (unit === 'kbps') {
					return tMediaPlayer('source.audio_with_ext_bitrate_kbps', { ext, bitrate: value });
				}
				return tMediaPlayer('source.audio_with_ext_bitrate_mbps', { ext, bitrate: value });
			}
			// Audio with bitrate only
			if (unit === 'kbps') {
				return tMediaPlayer('source.audio_with_bitrate_kbps', { bitrate: value });
			}
			return tMediaPlayer('source.audio_with_bitrate_mbps', { bitrate: value });
		}
		if (ext) {
			// Audio with extension only
			return tMediaPlayer('source.audio_with_ext', { ext });
		}
		// Base audio
		return tMediaPlayer('source.audio');
	}
	// VIDEO
	const height = selectedEnclosure.videoHeight;
	const ext = selectedEnclosure.fileExtension;
	if (height) {
		if (ext) {
			return tMediaPlayer('source.video_with_ext_resolution', { ext, resolution: height });
		}
		return tMediaPlayer('source.video_with_resolution', { resolution: height });
	}
	if (ext) {
		return tMediaPlayer('source.video_with_ext', { ext });
	}
	return tMediaPlayer('source.video');
}

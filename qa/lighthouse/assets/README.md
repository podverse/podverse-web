# Test Assets for Lighthouse QA

This directory contains test assets used for Lighthouse performance testing.

## Asset Location

All assets are served from `http://localhost:2111/` via a local HTTP server started automatically when running the Lighthouse tests.

## Required Files

The following files are automatically generated or provided:

### Channel Images (Generated)
- `chan-1-image.jpg` - Image for Podcast channel
- `chan-2-image.jpg` - Image for Video channel
- `chan-3-image.jpg` - Image for Music channel

### Item Images (Generated)
- `item-1-image.jpg` - Image for Podcast episode
- `item-2-image.jpg` - Image for Video episode
- `item-3-image.jpg` - Image for Music track

### Media Files (Generated - 5 minutes each)
- `item-1-podcast.mp3` - Audio file for Podcast episode (5 minutes)
- `item-2-video.mp4` - Video file for Video episode (5 minutes)
- `item-3-music.mp3` - Audio file for Music track (5 minutes)

### RSS Feed Files (Source controlled)
- `feed-1.rss` - RSS feed for Podcast channel
- `feed-2.rss` - RSS feed for Video channel
- `feed-3.rss` - RSS feed for Music channel

## Notes

- Generated files (images and media) are created automatically by the test suite if they don't exist
- Media files are 5 minutes long to prevent playback from ending during tests
- RSS feed files are source controlled and contain references to assets served from `localhost:2111`
- The database seed script (`local-lighthouse-test-fixtures.sql`) references these files via `localhost:2111` URLs

## Generation

Assets are automatically generated when you run `npm run test` in the `qa/lighthouse` directory. The asset generator creates:
- Minimal valid JPEG images
- Valid MP3 audio files (5 minutes of silence or minimal content)
- Valid MP4 video files (5 minutes of minimal video content)

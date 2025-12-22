# Podverse Web Updates

Welcome to the all-new Podverse! The new apps will be designed to support as many Podcasting 2.0 features and optimize performance as much as possible. Podverse "2.0" will be your ultimate RSS media library. We will support podcasts, videos, music, and livestreams as primary media types.

On this page, you will able to find the most notable changes between releases.

## [5.1.9] - 2025-12-20

Music updates: added the Music Livestreams and Music Livestream pages.

## [5.1.8] - 2025-12-19

Music updates: added the Albums, Album, Tracks, and Track pages.

There are separate playlists, queues, and histories for podcasts and music.

The "autoplay next" behavior is also different for podcasts and music. It will play the next most recent episode from that podcast when an episode is being played, and the next track from that album when a track is being played.

## [5.1.5] - 2025-12-03

Initial Alpha version release 🥳

The new Podverse website is now publicly available for testing. There is a lot to cover as this is the first update, and I can't cover all the differences, but I will mention some of the larger features.

- Home: This is the hub for all your subscriptions, across all media types. The newest podcasts, videos, music, and livestreams can all be easily found here. You can think of it as your "feed" where you receive all your updates.

- New web design: We are using a tab-based design to make the website layout more concise, with less blocky, vertical space. The tab design also makes it easier to make room for new Podcasting 2.0 features over time. There are imperfections still, but we will iron them out over time.

- Podcasts and Episodes: Playback for podcasts should work as of this release. The most visible difference is the ability to change page layouts (grid or list view).

- Media Player: The core feature of the website should be completed. We are determined to make the media player smoother than the old Podverse, and sync your last-played position across devices more reliably.

- Queues / History: You can now separate your queues and history by podcasts, videos, and music, instead of jumbling them all together.

- Playlists: You can now separate your playlists by podcasts, videos, and music.

- Podroll: This is new to Podverse, and features other content that a creator recommends to you. It will display on a podcast's page, when "podroll" is available in their RSS feed.

- People: Another new feature that displays info about a podcast's hosts, crew, guests, etc. (as long as the podcaster provides that info in the RSS feed).

- Clips: Our clips feature will mostly work the same as the previous Podverse.

- Chapters: These should work as you know and love them.

- Transcripts: Similar experience as the previous Podverse.

- Funding: Similar to the previous Podverse. This displays links to ways you can support a podcaster.

- Change playback source: Some RSS feeds give you multiple source options to listen to the same media file. The new UI will let you easily select your preference, when available. (In Podcasting 2.0 terms, this is called "alternate enclosure" support.)

- Categories: We've improved the category filtering experience. No more long waits or time outs when trying to browse by category.

- Faster page performance: Some pages in the old Podverse would take way too long (clips and category filters, for example). This problem was due to poor database architecture and bloat, which should be fixed going forward. This also relates to the next item in the list...

- Search: In the previous Podverse, we tried to add ALL of the world's RSS podcast feeds to the database. This resulted in a massive database with millions of podcasts and hundreds of millions of episodes.

Instead, the Podverse search page directly queries the Podcast Index, and if an RSS feed is not in our system, you can press the "Add Feed" button to add it.

We expect this to reduce our database bloat dramatically, and lead to a smoother and faster experience for listeners overall.

Coming soon...

- Videos, Music, Livestreams...these are all works in progress. The first 3 should be available in the next week, as the groundwork for them is already in place. Livestreams currently work in the Alpha Podverse, but the Livestreams page itself and notifications feature is not finished.

- Custom RSS feeds (private feeds that you manually add yourself) will take more time, but should be an upgraded experience compared to the older Podverse.

- Boosts / Value4Value - We will add this after the other pages I listed above are completed. Our new infrastructure is designed to be flexible, so multiple boost payment options can be used, as per the creator's preference.

Thanks for reading! It has been a long wait between the previous Podverse and now, but we think we have a strong foundation built for Podverse "2.0", and will be providing more regular updates through this page with each new release.

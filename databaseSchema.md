#Podverse Database Schema#

_The Podverse mobile app and web app **must** have the following properties. Properties ending with ! are required, properties with ? are optional._

####Podcast####
feedURL: String! - (unique ID) URL of the podcast's RSS Feed

title: String?

summary: String? - the podcast description

imageURL: String? -  URL of the full-size podcast logo

image: Data? - full-size podcast logo

itunesImageURL: String? - URL of the iTunes full-size podcast logo

itunesImage: Data? - square full-size iTunes podcast logo

imageThumb: Data? - thumbnail size (define?) podcast logo, calculated by Podverse based on the image or itunesImage file

iTunesAuthor: String? - podcast author name according to iTunes property

lastBuildDate: Date? - date the RSS Feed was last updated

lastPubDate: Date? - pubDate of the most recent episode in the RSS Feed, calculated by Podverse

episodes: Array<Object>

####Episode####
mediaURL: String! - (unique ID) URL of the episode media file

title: String?

summary: String? - the episode description

duration: Integer?

guid: String? - (alternate unique ID)

link: String? - the URL provided in the RSS feed's "link" field

mediaBytes: Integer? - the total file size of the episode media file in bytes

mediaType: String? - media file type (ex. audio/mpeg)

pubDate: Date? - the date/time the episode was released

clips: Array<Object>

podcast: Object!

####Clip####
clipURL: String? - (unique ID) the URL of the clip on podverse.fm

startTime: Integer! - in seconds

endTime: Integer! - in seconds

duration: Integer! - in seconds

title: String?

dateCreated: Date? - the date the clip was created

userID: String? - the ID of the user who created the clip

episode: Object!

####Playlist####
playlistId: String? - (unique ID) the ID of the playlist on podverse.fm

slug: String? - the slug of the playlist on podverse.fm

url: String? - the URL of the playlist on podverse.fm, derived from slug or playlistId

title: String!

sharePermission: String? - whether the playlist is shared publicly, can only be shared with link, or privately only to authorized viewers. Possible values are "isPublic", "isSharableWithLink", and "isPrivate".

lastUpdated: Date?

---

####Differences between mobile and web app####
isSubscribed boolean is in the mobile app Podcast model. In the web app this would be a property of the User model.

downloadComplete boolean is in the mobile app Episode model only. It states whether the episode's media file has been downloaded once already on the mobile app.

fileName string is in the mobile app Episode model only. It gives the local file name of an episode's downloaded media file.

playbackPosition integer is in the mobile app Episode model only, but it could be a part of the web app.

taskResumeData is in the mobile app Episode model only.

playlists array is in the mobile app Episode model. In the web app this would be a property of the User model.

playlists array is in the mobile app Clip model. In the web app this would be a property of the User model.

isMyEpisodes boolean is in the mobile app Playlist model. In the web app this would be a property of the User model. It states if a playlist is that user's default "My Episodes" playlist.

isMyClips boolean is in the mobile app Playlist model. In the web app this would be a property of the User model. It states if a playlist is that user's default "My Clips" playlist.

---

####Other Notes####
The image and itunesImage are usually identical podcast logo images. Some podcasters will share the image via the iTunes properties instead of a standard image property.

The mediaBytes property is useful for calculating clip start and end points for use in byte range request handers.

Tags are not a part of the Episode or Clip models right now, but they might be nice to have.

---

####To Do####
What properties are missing from the schema that should be documented?

userID - this should NOT be personally identifiable information (is that right?). Currently userIDs are only stored as email addresses. Should we change this?

imageThumb - what should the max-size and acceptable ratio be? (See [PVImageManipulator](https://github.com/podverse/podverse/blob/master/podverse/PVImageManipulator.swift#L11))

title - should it default to the "Untitled" String in the database if a title is unavailable?

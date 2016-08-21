#Podverse Database Schema#

_The Podverse mobile app and web app **must** be able to use the following properties. Properties ending with ! require values, and properties ending with ? do not require values._

NOTE: The schema for clips in the mobile app and web app is implemented differently. The web app uses _MediaRef_ instead of the _Clip_ model. Maybe someday we should sync the mobile and web app schema?

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

episodes: Array[Episode Object]?

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

clips: Array[Clip Object]?

podcast: Podcast Object!

playlist: Array[Playlist Object]?

####Clip####
_We need to clarify the distinction between Clips and MediaRefs. The mobile app uses Clips, but that approach is legacy at this point, as the web app uses MediaRefs instead of Clips._

id: UUID! - primary key ID of the clip on podverse.fm

podverseURL: String? - the URL of the clip hosted on podverse.fm, derived from id

ownerId: String! - the userId of whoever created the clip

title: String? – (if null, then a default title should be set in the templates using clip.title)

startTime: Integer! - in seconds

endTime: Integer? - in seconds

dateCreated: Date?

lastUpdated: Date?

sharePermission: ENUM? - possible values are "isPublic", "isSharableWithLink", and "isPrivate"

episode: Episode Object!

playlist: Array[Playlist Object]?

####Playlist####
id: UUID! - primary key ID of the playlist on podverse.fm

slug: String? - unique slug of the playlist on podverse.fm, the slug should never equal another playlist's id

podverseURL: String? - the URL of the playlist hosted on podverse.fm, derived from slug or id

ownerId: String! - unique userId of whoever created the playlist

ownerName: String? - name of whoever created the playlist

title: String?

dateCreated: Date?

lastUpdated: Date?

sharePermission: ENUM? - possible values are "isPublic", "isSharableWithLink", and "isPrivate"

isMyEpisodes: Bool – flag marking if the playlist is the owner's "My Episodes" playlist

isMyClips: Bool – flag marking if the playlist is the owner's "My Clips" playlist

episodes: Array[Episode Object]? (mediaRef)

clips: Array[Clip Object]? (mediaRef)

---

#####this stuff below needs to be updated#####

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

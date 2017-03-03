###TL;DR: In order to reliably create and share crowdsourced podcast clips in a free and decentralized fashion, 1) the podcast's RSS feed must include a UUID with every episode, and 2) the podcast's RSS feed must provide a link to the episode media file that will never change in duration.###

---

In order to provide a free and decentralized media referencing / clip making system with *minimal tech debt*, podcasts would need to provide two things:

1) a UUID for every episode

2) an episode media file URL that points to a media file of unchanging duration

---

##Notes##

It seems increasingly more common (although still mostly uncommon) for podcasts to rotate commercials in and out of their backlog of episode media files. This royally screws up the accuracy of the start / end times of clips.

This issue could be resolved if podcasters shared a episode media file URL that guarantees that the duration of the media file at that URL will never change (the content itself could change or be redacted, but the duration and temporal position of the content should remain the same).

I wonder if there's an existing RSS standard for a "link to an unchanging in duration media file" like that?

---

Sometime around mid-February, The Adam Carolla Podcast apparently switched the host of their episode media files. Since we're using episode media file URLs as the unique id of episodes, duplicate episodes were created by the feedparser after the change.

An issue like this seems like it could only be remedied by all podcast episodes having their own unique UUID, so that we can strictly use UUID's as unique episode identifiers. This corresponds with the standard <guid> field in RSS feeds, but a large % of users do not include guids, or do not include them in a consistent format.

I've found that a majority of podcasts DO provide a GUID, but the GUIDs are apparently not a UUID. Here are some examples:

<guid isPermaLink="false"><![CDATA[29e39c4189b41491144eb15bcd6e2928]]></guid>

<guid isPermaLink="false"><![CDATA[ce3f837e0e8929d8a5fe44f023ed0817]]></guid>

(If isPermaLink="true" then the element contains what I believe is supposed to be the permanent media url home for that episode's media file. I don't have an example of one of those atm...)

I know how to verify a UUID reliably, but I do not know how to verify whatever those ids are. They look random enough to me, but how do we ensure they are truly random? I have seen several instances of integers (1, 2, 3) passed in the <guid> field :(

---

On March 1 2017, Intercepted with Jeremy Scahill released an episode titled "Trump's Kabuki Theater Performance". On March 2, the same episode's title was changed to "Donald in Wonderland". I made a clip of this episode on March 1, and since clips and episodes are not associated in our db, the clip's page still displays the old episode title.

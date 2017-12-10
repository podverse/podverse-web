--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.6
-- Dumped by pg_dump version 9.6.1

--
-- Name: mediaRefs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "mediaRefs" (
    id text NOT NULL,
    "startTime" integer DEFAULT 0 NOT NULL,
    "endTime" integer,
    title text,
    description text,
    "ownerId" text,
    "ownerName" text,
    "dateCreated" timestamp with time zone,
    "lastUpdated" timestamp with time zone,
    "podcastTitle" text,
    "podcastFeedUrl" text NOT NULL,
    "podcastImageUrl" text,
    "episodeTitle" text,
    "episodeMediaUrl" text NOT NULL,
    "episodeImageUrl" text,
    "episodeLinkUrl" text,
    "episodePubDate" timestamp with time zone,
    "episodeSummary" text,
    "episodeDuration" integer,
    "pastHourTotalUniquePageviews" integer DEFAULT 0,
    "pastDayTotalUniquePageviews" integer DEFAULT 0,
    "pastWeekTotalUniquePageviews" integer DEFAULT 0,
    "pastMonthTotalUniquePageviews" integer DEFAULT 0,
    "pastYearTotalUniquePageviews" integer DEFAULT 0,
    "allTimeTotalUniquePageviews" integer DEFAULT 0,
    "isPublic" boolean DEFAULT false
);

--
-- Name: playlistItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "playlistItems" (
    "dateCreated" timestamp with time zone NOT NULL,
    "lastUpdated" timestamp with time zone NOT NULL,
    "playlistId" text NOT NULL,
    "mediaRefId" text NOT NULL
);

--
-- Name: playlists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE playlists (
    id text NOT NULL,
    slug text,
    title text NOT NULL,
    "ownerId" text NOT NULL,
    "ownerName" text,
    "dateCreated" timestamp with time zone,
    "lastUpdated" timestamp with time zone,
    "isRecommendation" boolean DEFAULT false,
    "isMyClips" boolean
);

--
-- Name: subscribedPlaylists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "subscribedPlaylists" (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" character varying(255) NOT NULL,
    "playlistId" text NOT NULL
);

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE users (
    id character varying(255) NOT NULL,
    name text,
    nickname text,
    "subscribedPodcastFeedUrls" text[] DEFAULT ARRAY[]::text[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

--
-- Name: mediaRefs mediaRefs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "mediaRefs"
    ADD CONSTRAINT "mediaRefs_pkey" PRIMARY KEY (id);


--
-- Name: playlistItems playlistItems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "playlistItems"
    ADD CONSTRAINT "playlistItems_pkey" PRIMARY KEY ("playlistId", "mediaRefId");


--
-- Name: playlists playlists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY playlists
    ADD CONSTRAINT playlists_pkey PRIMARY KEY (id);


--
-- Name: playlists playlists_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY playlists
    ADD CONSTRAINT playlists_slug_key UNIQUE (slug);

--
-- Name: subscribedPlaylists subscribedPlaylists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "subscribedPlaylists"
    ADD CONSTRAINT "subscribedPlaylists_pkey" PRIMARY KEY ("userId", "playlistId");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

--
-- Name: playlistItems playlistItems_mediaRefId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "playlistItems"
    ADD CONSTRAINT "playlistItems_mediaRefId_fkey" FOREIGN KEY ("mediaRefId") REFERENCES "mediaRefs"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: playlistItems playlistItems_playlistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "playlistItems"
    ADD CONSTRAINT "playlistItems_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES playlists(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subscribedPlaylists subscribedPlaylists_playlistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "subscribedPlaylists"
    ADD CONSTRAINT "subscribedPlaylists_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES playlists(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subscribedPlaylists subscribedPlaylists_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "subscribedPlaylists"
    ADD CONSTRAINT "subscribedPlaylists_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

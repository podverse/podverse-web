--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 9.6.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: podverse_web_dev; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE podverse_web_dev IS 'default administrative connection database';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: mediaRefs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "mediaRefs" (
    id uuid NOT NULL,
    "startTime" integer DEFAULT 0 NOT NULL,
    "endTime" integer,
    title text,
    description text,
    "ownerId" text,
    "ownerName" text,
    "dateCreated" timestamp with time zone,
    "lastUpdated" timestamp with time zone,
    "podcastTitle" text,
    "podcastFeedURL" text NOT NULL,
    "podcastImageURL" text,
    "episodeTitle" text,
    "episodeMediaURL" text NOT NULL,
    "episodeImageURL" text,
    "episodePubDate" timestamp with time zone,
    "episodeSummary" text,
    "episodeDuration" integer
);


ALTER TABLE "mediaRefs" OWNER TO postgres;

--
-- Name: playlistItems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "playlistItems" (
    "dateCreated" timestamp with time zone NOT NULL,
    "lastUpdated" timestamp with time zone NOT NULL,
    "playlistId" uuid NOT NULL,
    "mediaRefId" uuid NOT NULL
);


ALTER TABLE "playlistItems" OWNER TO postgres;

--
-- Name: playlists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE playlists (
    id uuid NOT NULL,
    slug text,
    title text NOT NULL,
    "ownerId" text NOT NULL,
    "ownerName" text,
    "dateCreated" timestamp with time zone,
    "lastUpdated" timestamp with time zone,
    "isRecommendation" boolean DEFAULT false,
    "isMyClips" boolean
);


ALTER TABLE playlists OWNER TO postgres;

--
-- Name: subscribedPlaylists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "subscribedPlaylists" (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" character varying(255) NOT NULL,
    "playlistId" uuid NOT NULL
);


ALTER TABLE "subscribedPlaylists" OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE users (
    id character varying(255) NOT NULL,
    name text,
    "subscribedPodcastFeedURLs" text[] DEFAULT ARRAY[]::text[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE users OWNER TO postgres;

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

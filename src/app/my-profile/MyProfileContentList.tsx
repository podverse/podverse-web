"use client";

import React from "react";
import { useMyProfileContentContext } from "./MyProfileContentContext";
import { ListPodcasts } from "../../components/List/Podcasts/ListPodcasts";
import { ListAlbums } from "../../components/List/Music/Albums/ListAlbums";
import { ListPlaylists } from "../../components/List/Playlists/ListPlaylists";
import { ListClips } from "../../components/List/Clips/ListClips";
import { NoResults } from "../../components/NoResults/NoResults";
import LoadingSpinnerOverlay from "../../components/LoadingSpinner/LoadingSpinnerOverlay";
import styles from "../../styles/app/profile/ProfileContentList.module.scss";

export const MyProfileContentList: React.FC = () => {
  const {
    selectedTab,
    podcasts,
    podcastsPage,
    setPodcastsPage,
    podcastsTotalPages,
    podcastsLoaded,
    albums,
    albumsPage,
    setAlbumsPage,
    albumsTotalPages,
    albumsLoaded,
    playlists,
    playlistsPage,
    setPlaylistsPage,
    playlistsTotalPages,
    playlistsLoaded,
    clips,
    clipsPage,
    setClipsPage,
    clipsTotalPages,
    clipsLoaded,
    isLoading
  } = useMyProfileContentContext();

  if (selectedTab === "podcasts") {
    // Show loading spinner if currently loading and data hasn't been loaded yet
    if (isLoading && !podcastsLoaded) {
      return <LoadingSpinnerOverlay isLoading={true} />;
    }

    // Show no results only if data has been loaded and there are no results
    const showNoResults = podcastsLoaded && !isLoading && podcastsPage <= 1 && podcasts.length === 0;
    
    if (showNoResults) {
      return <NoResults />;
    }

    return (
      <>
        <ListPodcasts
          page={podcastsPage}
          setPage={setPodcastsPage}
          channels={podcasts}
          totalPages={podcastsTotalPages}
          showSubscribeMessage={false}
          type="global"
          category={null}
          viewSelected="rows"
        />
        <LoadingSpinnerOverlay isLoading={isLoading && podcastsLoaded} />
      </>
    );
  }

  if (selectedTab === "albums") {
    // Show loading spinner if currently loading and data hasn't been loaded yet
    if (isLoading && !albumsLoaded) {
      return <LoadingSpinnerOverlay isLoading={true} />;
    }

    // Show no results only if data has been loaded and there are no results
    const showNoResults = albumsLoaded && !isLoading && albumsPage <= 1 && albums.length === 0;
    
    if (showNoResults) {
      return <NoResults />;
    }

    return (
      <>
        <ListAlbums
          page={albumsPage}
          setPage={setAlbumsPage}
          channels={albums}
          totalPages={albumsTotalPages}
          showSubscribeMessage={false}
          type="global"
          viewSelected="rows"
        />
        <LoadingSpinnerOverlay isLoading={isLoading && albumsLoaded} />
      </>
    );
  }

  if (selectedTab === "playlists") {
    // Show loading spinner if currently loading and data hasn't been loaded yet
    if (isLoading && !playlistsLoaded) {
      return <LoadingSpinnerOverlay isLoading={true} />;
    }

    // Show no results only if data has been loaded and there are no results
    const showNoResults = playlistsLoaded && !isLoading && playlistsPage <= 1 && playlists.length === 0;
    
    if (showNoResults) {
      return <NoResults />;
    }

    return (
      <>
        <ListPlaylists
          page={playlistsPage}
          setPage={setPlaylistsPage}
          playlists={playlists}
          totalPages={playlistsTotalPages}
          showLoginMessage={false}
          showCreator={false}
        />
        <LoadingSpinnerOverlay isLoading={isLoading && playlistsLoaded} />
      </>
    );
  }

  if (selectedTab === "clips") {
    // Show loading spinner if currently loading and data hasn't been loaded yet
    if (isLoading && !clipsLoaded) {
      return <LoadingSpinnerOverlay isLoading={true} />;
    }

    // Show no results only if data has been loaded and there are no results
    const showNoResults = clipsLoaded && !isLoading && clipsPage <= 1 && clips.length === 0;
    
    if (showNoResults) {
      return <NoResults />;
    }

    return (
      <>
        <div className={styles.clipsWrapper}>
          <ListClips
            page={clipsPage}
            setPage={setClipsPage}
            clips={clips}
            totalPages={clipsTotalPages}
            showSubscribeMessage={false}
            showItemInfo={true}
          />
        </div>
        <LoadingSpinnerOverlay isLoading={isLoading && clipsLoaded} />
      </>
    );
  }

  return null;
};

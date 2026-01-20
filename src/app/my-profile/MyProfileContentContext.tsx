"use client";

import { DTOAccount, DTOChannel, DTOClip, DTOPlaylist, getTotalPages } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { apiRequestService } from "../../factories/apiRequestService";
import { useSkipInitialEffect } from "../../hooks/useSkipInitialEffect";

export type MyProfileContentTab = 'podcasts' | 'albums' | 'playlists' | 'clips';

interface MyProfileContentContextType {
  account: DTOAccount;
  selectedTab: MyProfileContentTab;
  setSelectedTab: (tab: MyProfileContentTab) => void;
  
  // Podcasts
  podcasts: DTOChannel[];
  podcastsPage: number;
  setPodcastsPage: (page: number) => void;
  podcastsTotalPages: number;
  podcastsLoaded: boolean;
  
  // Albums
  albums: DTOChannel[];
  albumsPage: number;
  setAlbumsPage: (page: number) => void;
  albumsTotalPages: number;
  albumsLoaded: boolean;
  
  // Playlists
  playlists: DTOPlaylist[];
  playlistsPage: number;
  setPlaylistsPage: (page: number) => void;
  playlistsTotalPages: number;
  playlistsLoaded: boolean;
  
  // Clips
  clips: DTOClip[];
  clipsPage: number;
  setClipsPage: (page: number) => void;
  clipsTotalPages: number;
  clipsLoaded: boolean;
  
  isLoading: boolean;
}

const MyProfileContentContext = createContext<MyProfileContentContextType | undefined>(undefined);

interface MyProfileContentContextProviderProps {
  children: ReactNode;
  account: DTOAccount;
}

export const MyProfileContentContextProvider = ({
  children,
  account
}: MyProfileContentContextProviderProps) => {
  const [selectedTab, setSelectedTab] = useState<MyProfileContentTab>('podcasts');
  
  // Podcasts state
  const [podcasts, setPodcasts] = useState<DTOChannel[]>([]);
  const [podcastsPage, setPodcastsPage] = useState(1);
  const [podcastsTotalPages, setPodcastsTotalPages] = useState(1);
  const [podcastsLoaded, setPodcastsLoaded] = useState(false);
  
  // Albums state
  const [albums, setAlbums] = useState<DTOChannel[]>([]);
  const [albumsPage, setAlbumsPage] = useState(1);
  const [albumsTotalPages, setAlbumsTotalPages] = useState(1);
  const [albumsLoaded, setAlbumsLoaded] = useState(false);
  
  // Playlists state
  const [playlists, setPlaylists] = useState<DTOPlaylist[]>([]);
  const [playlistsPage, setPlaylistsPage] = useState(1);
  const [playlistsTotalPages, setPlaylistsTotalPages] = useState(1);
  const [playlistsLoaded, setPlaylistsLoaded] = useState(false);
  
  // Clips state
  const [clips, setClips] = useState<DTOClip[]>([]);
  const [clipsPage, setClipsPage] = useState(1);
  const [clipsTotalPages, setClipsTotalPages] = useState(1);
  const [clipsLoaded, setClipsLoaded] = useState(false);
  
  // Initialize loading state to true since we'll fetch data on mount for the default tab
  const [isLoading, setIsLoading] = useState(true);

  const fetchPodcasts = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await apiRequestService.reqMyProfilePodcastsAZ({ page });
      setPodcasts(response.data);
      setPodcastsTotalPages(getTotalPages(response.meta.count, response.meta.limit, response.data.length, page));
      setPodcastsLoaded(true);
    } catch (error) {
      console.error('Error fetching my profile podcasts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPlaylists = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await apiRequestService.reqMyProfilePlaylistsAZ({ page });
      setPlaylists(response.data);
      setPlaylistsTotalPages(getTotalPages(response.meta.count, response.meta.limit, response.data.length, page));
      setPlaylistsLoaded(true);
    } catch (error) {
      console.error('Error fetching my profile playlists:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAlbums = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await apiRequestService.reqMyProfileAlbumsAZ({ page });
      setAlbums(response.data);
      setAlbumsTotalPages(getTotalPages(response.meta.count, response.meta.limit, response.data.length, page));
      setAlbumsLoaded(true);
    } catch (error) {
      console.error('Error fetching my profile albums:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchClips = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await apiRequestService.reqMyProfileClipsRecent({ page });
      setClips(response.data);
      setClipsTotalPages(getTotalPages(response.meta.count, response.meta.limit, response.data.length, page));
      setClipsLoaded(true);
    } catch (error) {
      console.error('Error fetching my profile clips:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch initial data for selected tab on mount
  React.useEffect(() => {
    if (selectedTab === 'podcasts' && !podcastsLoaded) {
      fetchPodcasts(podcastsPage);
    } else if (selectedTab === 'albums' && !albumsLoaded) {
      fetchAlbums(albumsPage);
    } else if (selectedTab === 'playlists' && !playlistsLoaded) {
      fetchPlaylists(playlistsPage);
    } else if (selectedTab === 'clips' && !clipsLoaded) {
      fetchClips(clipsPage);
    }
  }, []); // Only run on mount

  // Fetch data when tab changes (load on first visit to tab)
  useSkipInitialEffect(() => {
    if (selectedTab === 'podcasts' && !podcastsLoaded) {
      fetchPodcasts(podcastsPage);
    } else if (selectedTab === 'albums' && !albumsLoaded) {
      fetchAlbums(albumsPage);
    } else if (selectedTab === 'playlists' && !playlistsLoaded) {
      fetchPlaylists(playlistsPage);
    } else if (selectedTab === 'clips' && !clipsLoaded) {
      fetchClips(clipsPage);
    }
  }, [selectedTab]);

  // Fetch when page changes (only for currently selected tab)
  useSkipInitialEffect(() => {
    if (podcastsLoaded && selectedTab === 'podcasts') {
      fetchPodcasts(podcastsPage);
    }
  }, [podcastsPage]);

  useSkipInitialEffect(() => {
    if (albumsLoaded && selectedTab === 'albums') {
      fetchAlbums(albumsPage);
    }
  }, [albumsPage]);

  useSkipInitialEffect(() => {
    if (playlistsLoaded && selectedTab === 'playlists') {
      fetchPlaylists(playlistsPage);
    }
  }, [playlistsPage]);

  useSkipInitialEffect(() => {
    if (clipsLoaded && selectedTab === 'clips') {
      fetchClips(clipsPage);
    }
  }, [clipsPage]);

  return (
    <MyProfileContentContext.Provider value={{
      account,
      selectedTab,
      setSelectedTab,
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
    }}>
      {children}
    </MyProfileContentContext.Provider>
  );
};

export const useMyProfileContentContext = () => {
  const ctx = useContext(MyProfileContentContext);
  if (!ctx) throw new Error("useMyProfileContentContext must be used within a MyProfileContentContextProvider");
  return ctx;
};

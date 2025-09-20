import { DTOPlaylist, generatePlaylistFavoritesIndex } from "podverse-helpers";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useContext } from "react";
import { apiRequestService } from "../factories/apiRequestService";

type PlaylistsFavoritesContextType = {
  playlistsFavorites: DTOPlaylist[];
  setPlaylistsFavorites: (val: DTOPlaylist[]) => void;
};

export const PlaylistsFavoritesContext = createContext<PlaylistsFavoritesContextType>({
  playlistsFavorites: [],
  setPlaylistsFavorites: () => {},
});

type PlaylistsFavoritesProviderProps = {
  children: ReactNode;
};

export const PlaylistsFavoritesProvider = ({
  children
}: PlaylistsFavoritesProviderProps) => {
  const [playlistsFavorites, setPlaylistsFavorites] = useState<DTOPlaylist[]>([]);

  useEffect(() => {
    (async () => {
      const data = await apiRequestService.reqPlaylistGetAllFavoritesPrivate();
      console.log("Fetched favorite playlists from API:", data);

      const index = generatePlaylistFavoritesIndex(data);
      console.log("Generated playlist favorites index:", index);
    })();
  }, []);

  return (
    <PlaylistsFavoritesContext.Provider
      value={{ playlistsFavorites, setPlaylistsFavorites }}>
      {children}
    </PlaylistsFavoritesContext.Provider>
  );
};

export function usePlaylistsFavorites() {
  const ctx = useContext(PlaylistsFavoritesContext);
  if (!ctx) throw new Error("usePlaylistsFavorites must be used within a PlaylistsFavoritesProvider");
  return ctx;
}

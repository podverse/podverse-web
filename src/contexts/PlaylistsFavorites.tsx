import { DTOPlaylist /*, generatePlaylistFavoritesIndex */ } from "podverse-helpers";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useContext } from "react";
// import { apiRequestService } from "../factories/apiRequestService";
import { useAccount } from "./Account";

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
  const { loggedInAccount } = useAccount();

  useEffect(() => {
    (async () => {
      if (!loggedInAccount) {
        setPlaylistsFavorites([]);
        return;
      }
      
      // const data = await apiRequestService.reqPlaylistGetAllFavoritesPrivate();      
      // const index = generatePlaylistFavoritesIndex(data);
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

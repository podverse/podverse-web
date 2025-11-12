import { DTOChannel, DTOClip, DTOItem, DTOItemChapter, DTOItemSoundbite,
  PlaybackMode, PlaybackSpeedValue } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";

type MediaPlayerContextType = {
  mpChannel: DTOChannel | null;
  setMPChannel: (val: DTOChannel | null) => void;
  mpItem: DTOItem | null;
  setMPItem: (val: DTOItem | null) => void;
  mpClip: DTOClip | null;
  setMPClip: (val: DTOClip | null) => void;
  mpItemChapter: DTOItemChapter | null;
  setMPItemChapter: (val: DTOItemChapter | null) => void;
  mpItemChapters: DTOItemChapter[] | null;
  setMPItemChapters: (val: DTOItemChapter[] | null) => void;
  mpItemChapterShouldSeek: boolean;
  setMPItemChapterShouldSeek: (val: boolean) => void;
  mpItemSoundbite: DTOItemSoundbite | null;
  setMPItemSoundbite: (val: DTOItemSoundbite | null) => void;
  mpEnclosureRowSelected: number;
  setMPEnclosureRowSelected: (val: number) => void;
  mpIsPlaying: boolean;
  setMPIsPlaying: (val: boolean) => void;
  mpPlaybackMode: PlaybackMode;
  setMPPlaybackMode: (val: PlaybackMode) => void;
  mpPlaybackSpeed: PlaybackSpeedValue;
  setMPPlaybackSpeed: (val: PlaybackSpeedValue) => void;
  mpIsMuted: boolean;
  setMPIsMuted: (val: boolean) => void;
  mpVolume: number;
  setMPVolume: (val: number) => void;
  mpDuration: number;
  setMPDuration: (val: number) => void;
  playerModalIsOpen: boolean;
  setPlayerModalIsOpen: (val: boolean) => void;
  mpShouldPlay: boolean;
  setMPShouldPlay: (val: boolean) => void;
};

export const MediaPlayerContext = createContext<MediaPlayerContextType | undefined>(undefined);

type MediaPlayerProviderProps = {
  children: ReactNode;
};

export const MediaPlayerProvider = ({ children }: MediaPlayerProviderProps) => {
  const [mpChannel, setMPChannel] = useState<DTOChannel | null>(null);
  const [mpItem, setMPItem] = useState<DTOItem | null>(null);
  const [mpClip, setMPClip] = useState<DTOClip | null>(null);
  const [mpItemChapter, setMPItemChapter] = useState<DTOItemChapter | null>(null);
  const [mpItemChapters, setMPItemChapters] = useState<DTOItemChapter[] | null>(null);
  const [mpItemChapterShouldSeek, setMPItemChapterShouldSeek] = useState<boolean>(false);
  const [mpItemSoundbite, setMPItemSoundbite] = useState<DTOItemSoundbite | null>(null);
  const [mpEnclosureRowSelected, setMPEnclosureRowSelected] = useState<number>(0);
  const [mpIsPlaying, setMPIsPlaying] = useState<boolean>(false);
  const [mpPlaybackMode, setMPPlaybackMode] = useState<PlaybackMode>("autoplay-next");
  const [mpPlaybackSpeed, setMPPlaybackSpeed] = useState<PlaybackSpeedValue>(1.0);
  const [mpIsMuted, setMPIsMuted] = useState<boolean>(false);
  const [mpVolume, setMPVolume] = useState<number>(1.0);
  const [mpDuration, setMPDuration] = useState<number>(0);
  const [playerModalIsOpen, setPlayerModalIsOpen] = useState<boolean>(false);
  const [mpShouldPlay, setMPShouldPlay] = useState<boolean>(false);

  return (
    <MediaPlayerContext.Provider value={{
      mpChannel, setMPChannel,
      mpItem, setMPItem,
      mpClip, setMPClip,
      mpItemChapter, setMPItemChapter,
      mpItemChapters, setMPItemChapters,
      mpItemChapterShouldSeek, setMPItemChapterShouldSeek,
      mpItemSoundbite, setMPItemSoundbite,
      mpEnclosureRowSelected, setMPEnclosureRowSelected,
      mpIsPlaying, setMPIsPlaying,
      mpPlaybackMode, setMPPlaybackMode,
      mpPlaybackSpeed, setMPPlaybackSpeed,
      mpIsMuted, setMPIsMuted,
      mpVolume, setMPVolume,
      mpDuration, setMPDuration,
      playerModalIsOpen, setPlayerModalIsOpen,
      mpShouldPlay, setMPShouldPlay
    }}>
      {children}
    </MediaPlayerContext.Provider>
  );
};

export function useMediaPlayer() {
  const ctx = useContext(MediaPlayerContext);
  if (!ctx) throw new Error("useMediaPlayer must be used within a MediaPlayerProvider");
  return ctx;
}

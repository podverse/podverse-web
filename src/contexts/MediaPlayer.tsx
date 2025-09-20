import { DTOChannel, DTOClip, DTOItem, PlaybackSpeed } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { updateLayoutForMediaPlayer } from "../utils/mediaPlayer/mediaPlayerLayout";

type MediaPlayerContextType = {
  mpChannel: DTOChannel | null;
  setMPChannel: (val: DTOChannel | null) => void;
  mpItem: DTOItem | null;
  setMPItem: (val: DTOItem | null) => void;
  mpClip: DTOClip | null;
  setMPClip: (val: DTOClip | null) => void;
  mpIsPlaying: boolean;
  setMPIsPlaying: (val: boolean) => void;
  mpPlaybackSpeed: PlaybackSpeed;
  setMPPlaybackSpeed: (val: PlaybackSpeed) => void;
  mpIsMuted: boolean;
  setMPIsMuted: (val: boolean) => void;
  mpVolume: number;
  setMPVolume: (val: number) => void;
  mpCurrentTime: number;
  setMPCurrentTime: (val: number) => void;
  mpDuration: number;
  setMPDuration: (val: number) => void;
};

export const MediaPlayerContext = createContext<MediaPlayerContextType | undefined>(undefined);

type MediaPlayerProviderProps = {
  children: ReactNode;
};

export const MediaPlayerProvider = ({ children }: MediaPlayerProviderProps) => {
  const [mpChannel, setMPChannel] = useState<DTOChannel | null>(null);
  const [mpItem, setMPItem] = useState<DTOItem | null>(null);
  const [mpClip, setMPClip] = useState<DTOClip | null>(null);
  const [mpIsPlaying, setMPIsPlaying] = useState<boolean>(false);
  const [mpPlaybackSpeed, setMPPlaybackSpeed] = useState<PlaybackSpeed>(1.0);
  const [mpIsMuted, setMPIsMuted] = useState<boolean>(false);
  const [mpVolume, setMPVolume] = useState<number>(1.0);
  const [mpCurrentTime, setMPCurrentTime] = useState<number>(0);
  const [mpDuration, setMPDuration] = useState<number>(0);

  useEffect(() => {
    updateLayoutForMediaPlayer(!!mpChannel);
  }, [mpChannel, mpItem, mpClip]);

  return (
    <MediaPlayerContext.Provider value={{
      mpChannel, setMPChannel,
      mpItem, setMPItem,
      mpClip, setMPClip,
      mpIsPlaying, setMPIsPlaying,
      mpPlaybackSpeed, setMPPlaybackSpeed,
      mpIsMuted, setMPIsMuted,
      mpVolume, setMPVolume,
      mpCurrentTime, setMPCurrentTime,
      mpDuration, setMPDuration
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

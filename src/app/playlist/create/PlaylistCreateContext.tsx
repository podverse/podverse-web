"use client";

import { MediumEnum, SharableStatusEnum } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface PlaylistCreateContextType {
  medium: string;
  setMedium: (medium: string) => void;
  sharableStatus: string;
  setSharableStatus: (status: string) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  isUpdating: boolean;
  setIsUpdating: (isUpdating: boolean) => void;
};

const PlaylistCreateContext = createContext<PlaylistCreateContextType | undefined>(undefined);

interface PlaylistCreateContextProviderProps {
  children: ReactNode
}

export const PlaylistCreateContextProvider = (
  { children }: PlaylistCreateContextProviderProps) => {
  const [medium, setMedium] = useState<string>(`${MediumEnum.Podcast}`);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [sharableStatus, setSharableStatus] = useState<string>(`${SharableStatusEnum.Private}`);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  return (
    <PlaylistCreateContext.Provider value={{
      medium, setMedium,
      title, setTitle,
      description, setDescription,
      sharableStatus, setSharableStatus,
      isUpdating, setIsUpdating
    }}>
      {children}
    </PlaylistCreateContext.Provider>
  );
};

export const usePlaylistCreateContext = () => {
  const ctx = useContext(PlaylistCreateContext);
  if (!ctx) throw new Error("usePlaylistCreateContext must be used within a PlaylistCreateContextProvider");
  return ctx;
};

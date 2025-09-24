"use client";

import { DTOClip, formatNumericToHHMMSS } from "podverse-helpers";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useMediaPlayer } from "../../../../contexts/MediaPlayer";

interface ClipEditContextType {
  sharableStatus: string
  setSharableStatus: (status: string) => void
  title: string
  setTitle: (title: string) => void
  startTimeString: string
  setStartTimeString: (time: string) => void
  endTimeString?: string | null
  setEndTimeString: (time: string) => void
  isUpdating: boolean
  setIsUpdating: (updating: boolean) => void
  onSubmit: () => void
  onCancel: () => void
};

const ClipEditContext = createContext<ClipEditContextType | undefined>(undefined);

interface ClipEditContextProviderProps {
  children: ReactNode
  ssrClip: DTOClip
}

export const ClipEditContextProvider = (
  { children, ssrClip }: ClipEditContextProviderProps) => {
  const [sharableStatus, setSharableStatus] = useState<string>(`${ssrClip.sharable_status.id}`);
  const [title, setTitle] = useState<string>(ssrClip.title || "");
  const [startTimeString, setStartTimeString] = useState<string>(formatNumericToHHMMSS(ssrClip.start_time));
  const [endTimeString, setEndTimeString] = useState<string | null>(ssrClip.end_time ? formatNumericToHHMMSS(ssrClip.end_time) : null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const { setMPChannel, setMPItem, setMPClip } = useMediaPlayer();

  useEffect(() => {
    const item = ssrClip?.item;
    const channel = ssrClip?.item?.channel;

    if (item && channel) {
      setMPChannel(channel);
      setMPItem(item);
      setMPClip(ssrClip);
    }
  }, []);

  return (
    <ClipEditContext.Provider value={{
      sharableStatus, setSharableStatus,
      title, setTitle,
      startTimeString, setStartTimeString,
      endTimeString, setEndTimeString,
      isUpdating, setIsUpdating,
      onSubmit: () => { },
      onCancel: () => { },
    }}>
      {children}
    </ClipEditContext.Provider>
  );
};

export const useClipEditContext = () => {
  const ctx = useContext(ClipEditContext);
  if (!ctx) throw new Error("useClipEditContext must be used within a ClipEditContextProvider");
  return ctx;
};

import { DTOChannel, DTOClip, DTOItem, DTOItemChapter, DTOItemSoundbite } from 'podverse-helpers'
import React, { createContext, useContext, useState, ReactNode } from 'react'

type ModalBasic = {
  isOpen: boolean;
}

type ModalPlaylistAddTo = {
  channel: DTOChannel | null;
  item: DTOItem | null;
  clip: DTOClip | null;
  item_chapter: DTOItemChapter | null;
  item_soundbite: DTOItemSoundbite | null;
}

type ModalClip = {
  channel: DTOChannel | null;
  item: DTOItem | null;
}

type ModalClipCreated = {
  clip: DTOClip | null;
}

type ModalsContextType = {
  modalLogin: ModalBasic;
  setModalLogin: (val: ModalBasic) => void;
  modalSignUp: ModalBasic;
  setModalSignUp: (val: ModalBasic) => void;
  modalPlaylistAddTo: ModalPlaylistAddTo;
  setModalPlaylistAddTo: (val: ModalPlaylistAddTo) => void;
  modalClip: ModalClip;
  setModalClip: (val: ModalClip) => void;
  modalClipCreated: ModalClipCreated;
  setModalClipCreated: (val: ModalClipCreated) => void;
}

const ModalsContext = createContext<ModalsContextType | undefined>(undefined)

const defaultModalPlaylistAddTo = {
  channel: null,
  item: null,
  clip: null,
  item_chapter: null,
  item_soundbite: null
}

const defaultModalClip = {
  channel: null,
  item: null
}

const defaultModalClipCreated = {
  clip: null
}

export const ModalsProvider = ({ children }: { children: ReactNode }) => {
  const [modalLogin, setModalLogin] = useState<ModalBasic>({ isOpen: false })
  const [modalSignUp, setModalSignUp] = useState<ModalBasic>({ isOpen: false })
  const [modalPlaylistAddTo, setModalPlaylistAddTo] = useState<ModalPlaylistAddTo>(defaultModalPlaylistAddTo)
  const [modalClip, setModalClip] = useState<ModalClip>(defaultModalClip)
  const [modalClipCreated, setModalClipCreated] = useState<ModalClipCreated>(defaultModalClipCreated)

  return (
    <ModalsContext.Provider value={{
      modalLogin, setModalLogin,
      modalSignUp, setModalSignUp,
      modalPlaylistAddTo, setModalPlaylistAddTo,
      modalClip, setModalClip,
      modalClipCreated, setModalClipCreated
    }}>
      {children}
    </ModalsContext.Provider>
  )
}

export const useModals = () => {
  const context = useContext(ModalsContext)
  if (!context) throw new Error('useModals must be used within a ModalsProvider')
  return context
}
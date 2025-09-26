import { DTOChannel, DTOChannelFunding, DTOClip, DTOItem, DTOItemChapter, DTOItemFunding, DTOItemSoundbite } from 'podverse-helpers'
import React, { createContext, useContext, useState, ReactNode } from 'react'

type ModalBasic = {
  isOpen: boolean;
}

type ModalClip = {
  channel: DTOChannel | null;
  item: DTOItem | null;
}

type ModalClipCreated = {
  clip: DTOClip | null;
}

type ModalShare = {
  channel?: DTOChannel;
  item?: DTOItem;
  clip?: DTOClip;
  item_chapter?: DTOItemChapter;
  item_soundbite?: DTOItemSoundbite;
}

type ModalFunding = {
  channel_fundings: DTOChannelFunding[];
  item_fundings: DTOItemFunding[];
}

type ModalBoost = {
  channel?: DTOChannel;
  item?: DTOItem;
}

export type ModalPlaylistAddToState = {
  channel: DTOChannel | null;
  item: DTOItem | null;
  clip: DTOClip | null;
  item_chapter: DTOItemChapter | null;
  item_soundbite: DTOItemSoundbite | null;
}

type ModalsContextType = {
  modalLogin: ModalBasic;
  setModalLogin: (val: ModalBasic) => void;
  modalSignUp: ModalBasic;
  setModalSignUp: (val: ModalBasic) => void;
  modalPlaylistAddTo: ModalPlaylistAddToState;
  setModalPlaylistAddTo: (val: ModalPlaylistAddToState) => void;
  modalClip: ModalClip;
  setModalClip: (val: ModalClip) => void;
  modalClipCreated: ModalClipCreated;
  setModalClipCreated: (val: ModalClipCreated) => void;
  modalMediaPlayerIsOpen: boolean;
  setModalMediaPlayerIsOpen: (val: boolean) => void;
  modalShare: ModalShare;
  setModalShare: (val: ModalShare) => void;
  modalFunding: ModalFunding;
  setModalFunding: (val: ModalFunding) => void;
  modalBoost: ModalBoost;
  setModalBoost: (val: ModalBoost) => void;
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

const defaultModalBoost = {}

const defaultModalFunding = {
  channel_fundings: [],
  item_fundings: []
}

const defaultModalShare = {};

export const ModalsProvider = ({ children }: { children: ReactNode }) => {
  const [modalLogin, setModalLogin] = useState<ModalBasic>({ isOpen: false })
  const [modalSignUp, setModalSignUp] = useState<ModalBasic>({ isOpen: false })
  const [modalPlaylistAddTo, setModalPlaylistAddTo] = useState<ModalPlaylistAddToState>(defaultModalPlaylistAddTo)
  const [modalClip, setModalClip] = useState<ModalClip>(defaultModalClip)
  const [modalClipCreated, setModalClipCreated] = useState<ModalClipCreated>(defaultModalClipCreated)
  const [modalMediaPlayerIsOpen, setModalMediaPlayerIsOpen] = useState<boolean>(false)
  const [modalShare, setModalShare] = useState<ModalShare>(defaultModalShare)
  const [modalFunding, setModalFunding] = useState<ModalFunding>(defaultModalFunding)
  const [modalBoost, setModalBoost] = useState<ModalBoost>(defaultModalBoost)

  return (
    <ModalsContext.Provider value={{
      modalLogin, setModalLogin,
      modalSignUp, setModalSignUp,
      modalPlaylistAddTo, setModalPlaylistAddTo,
      modalClip, setModalClip,
      modalClipCreated, setModalClipCreated,
      modalMediaPlayerIsOpen, setModalMediaPlayerIsOpen,
      modalShare, setModalShare,
      modalFunding, setModalFunding,
      modalBoost, setModalBoost
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

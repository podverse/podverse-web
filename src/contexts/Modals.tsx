import { DTOChannel, DTOChannelFunding, DTOClip, DTOItem, DTOItemChapter, DTOItemFunding, DTOItemSoundbite, LabeledItemEnclosure } from 'podverse-helpers'
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { SourceSelectorActionType } from '../components/SourceSelectors/SourceSelectors';

type ModalBasic = {
  isOpen: boolean;
}

type ModalMessage = {
  title: string | null;
  message: string | null;
}

type ModalClip = {
  channel: DTOChannel | null;
  item: DTOItem | null;
}

type ModalClipCreated = {
  clip: DTOClip | null;
}

type ModalShare = {
  channel: DTOChannel | null;
  item: DTOItem | null;
  clip: DTOClip | null;
  item_chapter: DTOItemChapter | null;
  item_soundbite: DTOItemSoundbite | null;
}

type ModalFunding = {
  channel_fundings: DTOChannelFunding[];
  item_fundings: DTOItemFunding[];
}

type ModalBoost = {
  channel: DTOChannel | null;
  item: DTOItem | null;
}

export type ModalSourceSelector = {
  labeledItemEnclosures: LabeledItemEnclosure[];
  actionType: SourceSelectorActionType;
  itemTitle: string | null;
}

export type ModalPlaylistAddToState = {
  channel: DTOChannel | null;
  item: DTOItem | null;
  clip: DTOClip | null;
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
  modalSourceSelector: ModalSourceSelector;
  setModalSourceSelector: (val: ModalSourceSelector) => void;
  modalBoost: ModalBoost;
  setModalBoost: (val: ModalBoost) => void;
  modalLoginRequired: ModalMessage;
  setModalLoginRequired: (val: ModalMessage) => void;
}

const ModalsContext = createContext<ModalsContextType | undefined>(undefined)

const defaultModalPlaylistAddTo = {
  channel: null,
  item: null,
  clip: null,
  item_soundbite: null
}

const defaultModalClip = {
  channel: null,
  item: null
}

const defaultModalClipCreated = {
  clip: null
}

const defaultModalBoost = {
  channel: null,
  item: null
}

const defaultModalFunding = {
  channel_fundings: [],
  item_fundings: []
}

const defaultModalSourceSelector: ModalSourceSelector = {
  labeledItemEnclosures: [],
  actionType: null,
  itemTitle: null
}

const defaultModalShare = {
  channel: null,
  item: null,
  clip: null,
  item_chapter: null,
  item_soundbite: null
};

const defaultModalLoginRequired = {
  title: null,
  message: null
};

export const ModalsProvider = ({ children }: { children: ReactNode }) => {
  const [modalLogin, setModalLogin] = useState<ModalBasic>({ isOpen: false })
  const [modalSignUp, setModalSignUp] = useState<ModalBasic>({ isOpen: false })
  const [modalPlaylistAddTo, setModalPlaylistAddTo] = useState<ModalPlaylistAddToState>(defaultModalPlaylistAddTo)
  const [modalClip, setModalClip] = useState<ModalClip>(defaultModalClip)
  const [modalClipCreated, setModalClipCreated] = useState<ModalClipCreated>(defaultModalClipCreated)
  const [modalMediaPlayerIsOpen, setModalMediaPlayerIsOpen] = useState<boolean>(false)
  const [modalShare, setModalShare] = useState<ModalShare>(defaultModalShare)
  const [modalFunding, setModalFunding] = useState<ModalFunding>(defaultModalFunding)
  const [modalSourceSelector, setModalSourceSelector] = useState<ModalSourceSelector>(defaultModalSourceSelector)
  const [modalBoost, setModalBoost] = useState<ModalBoost>(defaultModalBoost)
  const [modalLoginRequired, setModalLoginRequired] = useState<ModalMessage>(defaultModalLoginRequired)

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
      modalSourceSelector, setModalSourceSelector,
      modalBoost, setModalBoost,
      modalLoginRequired, setModalLoginRequired
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

import { DTOChannel, DTOClip, DTOItem, DTOItemChapter, DTOItemSoundbite } from 'podverse-helpers'
import React, { createContext, useContext, useState, ReactNode } from 'react'

type ModalBasic = {
  isOpen: boolean;
}

type ModalPlaylistAddTo = {
  channel: DTOChannel | null;
  item: DTOItem | null;
  clip: DTOClip | null;
  chapter: DTOItemChapter | null;
  soundbite: DTOItemSoundbite | null;
}

type ModalsContextType = {
  modalLogin: ModalBasic;
  setModalLogin: (val: ModalBasic) => void;
  modalSignUp: ModalBasic;
  setModalSignUp: (val: ModalBasic) => void;
  modalPlaylistAddTo: ModalPlaylistAddTo;
  setModalPlaylistAddTo: (val: ModalPlaylistAddTo) => void;
}

const ModalsContext = createContext<ModalsContextType | undefined>(undefined)

const defaultModalPlaylistAddTo = {
  channel: null,
  item: null,
  clip: null,
  chapter: null,
  soundbite: null
}

export const ModalsProvider = ({ children }: { children: ReactNode }) => {
  const [modalLogin, setModalLogin] = useState<ModalBasic>({ isOpen: false })
  const [modalSignUp, setModalSignUp] = useState<ModalBasic>({ isOpen: false })
  const [modalPlaylistAddTo, setModalPlaylistAddTo] = useState<ModalPlaylistAddTo>(defaultModalPlaylistAddTo)

  return (
    <ModalsContext.Provider value={{
      modalLogin, setModalLogin,
      modalSignUp, setModalSignUp,
      modalPlaylistAddTo, setModalPlaylistAddTo
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
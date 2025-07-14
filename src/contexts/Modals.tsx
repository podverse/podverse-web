import React, { createContext, useContext, useState, ReactNode } from 'react'

type ModalsState = {
  LoginModal: { isOpen: boolean }
  SignUpModal: { isOpen: boolean }
}

type ModalsContextType = {
  modals: ModalsState
  openModal: (modal: keyof ModalsState) => void
  closeModal: (modal: keyof ModalsState) => void
}

const defaultState: ModalsState = {
  LoginModal: { isOpen: false },
  SignUpModal: { isOpen: false },
}

const ModalsContext = createContext<ModalsContextType | undefined>(undefined)

export const ModalsProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<ModalsState>(defaultState)

  const openModal = (modal: keyof ModalsState) => {
    setModals(prev => ({
      ...prev,
      [modal]: { isOpen: true }
    }))
  }

  const closeModal = (modal: keyof ModalsState) => {
    setModals(prev => ({
      ...prev,
      [modal]: { isOpen: false }
    }))
  }

  return (
    <ModalsContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
    </ModalsContext.Provider>
  )
}

export const useModals = () => {
  const context = useContext(ModalsContext)
  if (!context) throw new Error('useModals must be used within a ModalsProvider')
  return context
}
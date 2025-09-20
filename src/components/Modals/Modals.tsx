"use client";

import React from 'react'
import { LoginModal } from '../Auth/LoginModal'
import { ModalPlaylistAddTo } from '../Modal/ModalPlaylistAddTo';

export const Modals: React.FC = () => {
  return (
    <>
      <LoginModal />
      <ModalPlaylistAddTo />
    </>
  )
}
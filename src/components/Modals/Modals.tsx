"use client";

import React from 'react'
import { LoginModal } from '../Auth/LoginModal'
import { ModalPlaylistAddTo } from '../Modal/ModalPlaylistAddTo';
import { ModalClip } from '../Modal/ModalClip';
import { ModalClipCreated } from '../Modal/ModalClipCreated';
import { ModalShare } from '../Modal/ModalShare';
import { ModalFunding } from '../Modal/ModalFunding';
import { ModalBoost } from '../Modal/ModalBoost';
import { ModalSourceSelector } from '../Modal/ModalSourceSelector';

export const Modals: React.FC = () => {
  return (
    <>
      <LoginModal />
      <ModalPlaylistAddTo />
      <ModalClip />
      <ModalClipCreated />
      <ModalShare />
      <ModalFunding />
      <ModalBoost />
      <ModalSourceSelector />
    </>
  )
}
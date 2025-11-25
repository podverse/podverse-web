"use client";

import React from 'react'
import { ModalAuthLogin } from '../Modal/ModalAuthLogin'
import { ModalPlaylistAddTo } from '../Modal/ModalPlaylistAddTo';
import { ModalClip } from '../Modal/ModalClip';
import { ModalClipCreated } from '../Modal/ModalClipCreated';
import { ModalShare } from '../Modal/ModalShare';
import { ModalFunding } from '../Modal/ModalFunding';
import { ModalBoost } from '../Modal/ModalBoost';
import { ModalSourceSelector } from '../Modal/ModalSourceSelector';
import { ModalDisclaimer } from '../Modal/ModalDisclaimer';
import { ModalLoginRequired } from '../Modal/ModalLoginRequired';
import { useLocalSettings } from '../../contexts/LocalSettings';

export const Modals: React.FC = () => {
  const { serverEnvironmentDisclaimerAccepted } = useLocalSettings();
  
  return (
    <>
      <ModalAuthLogin />
      <ModalPlaylistAddTo />
      <ModalClip />
      <ModalClipCreated />
      <ModalShare />
      <ModalFunding />
      <ModalBoost />
      <ModalSourceSelector />
      <ModalLoginRequired />
      <ModalDisclaimer isOpen={!serverEnvironmentDisclaimerAccepted} />
    </>
  )
}
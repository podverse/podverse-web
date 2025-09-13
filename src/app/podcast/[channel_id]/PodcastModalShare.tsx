"use client";

import { useTranslations } from 'next-intl';
import { DTOChannel } from 'podverse-helpers';
import React from 'react'
import { ModalShare, ModalShareInput } from '../../../components/Modal/ModalShare'
import { usePodcastContext } from './PodcastContext';
import { WEB } from '../../../constants/web';

type PodcastModalShareProps = {
  channel: DTOChannel;
}

export const PodcastModalShare: React.FC<PodcastModalShareProps> = ({ channel }) => {
  const { podcastModalShareIsOpen, setPodcastModalShareIsOpen } = usePodcastContext();
  const tMedia = useTranslations("media");
  const tFeatures = useTranslations("features");

  const pageUrl = `${WEB.origin}/podcast/${channel.id_text}`;

  const shareInputs: ModalShareInput[] = [
    {
      name: "podcast",
      value: pageUrl,
      eyebrow: tMedia("podcast.podcast"),
    },
    {
      name: "embed",
      value: `TODO: add embed code here`,
      eyebrow: tFeatures("embed"),
    }
  ]

  return (
    <ModalShare
      isOpen={podcastModalShareIsOpen}
      onClose={() => setPodcastModalShareIsOpen(false)}
      shareInputs={shareInputs}
    />
  )
}

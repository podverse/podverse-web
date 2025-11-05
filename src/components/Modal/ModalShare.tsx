"use client";

import { useTranslations } from 'next-intl';
import { copyToClipboard, MediumEnum } from 'podverse-helpers';
import React, { useRef, useState } from 'react'
import { Modal } from './Modal'
import { TextInput } from '../Form/TextInput';
import { useModals } from '../../contexts/Modals';
import { WEB } from '../../constants/web';

type ModalShareInput = {
  name: string;
  value: string;
  eyebrow?: string;
};

export const ModalShare: React.FC = () => {
  const tFeatures = useTranslations("features");
  const tMedia = useTranslations("media");
  const tInfo = useTranslations("info");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { modalShare, setModalShare } = useModals();
  
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isOpen = !!modalShare.channel;

  if (!!!modalShare.channel) return null;

  const handleCopy = (value: string, idx: number) => {
    copyToClipboard(value);
    setCopiedIndex(idx);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };
  
  const shareInputs: ModalShareInput[] = [];

  if (modalShare.channel.medium_id === MediumEnum.Podcast) {
    shareInputs.push({
      name: "podcast",
      value: `${WEB.origin}/podcast/${modalShare.channel.id_text}`,
      eyebrow: tMedia("podcast.podcast"),
    });

    if (modalShare.item) {
      shareInputs.push({
        name: "episode",
        value: `${WEB.origin}/episode/${modalShare.item.id_text}`,
        eyebrow: tMedia("podcast.episode"),
      });
    }
  } else if (modalShare.channel.medium_id === MediumEnum.Video) {
    shareInputs.push({
      name: "channel",
      value: `${WEB.origin}/channel/${modalShare.channel.id_text}`,
      eyebrow: tMedia("video.channel"),
    });

    if (modalShare.item) {
      shareInputs.push({
        name: "video",
        value: `${WEB.origin}/video/${modalShare.item.id_text}`,
        eyebrow: tMedia("video.video"),
      });
    }
  } else if (modalShare.channel.medium_id === MediumEnum.Music) {
    shareInputs.push({
      name: "album",
      value: `${WEB.origin}/album/${modalShare.channel.id_text}`,
      eyebrow: tMedia("music.album"),
    });

    if (modalShare.item) {
      shareInputs.push({
        name: "track",
        value: `${WEB.origin}/track/${modalShare.item.id_text}`,
        eyebrow: tMedia("music.track"),
      });
    }
  }

  if (modalShare.clip) {
    shareInputs.push({
      name: "clip.clip",
      value: `${WEB.origin}/clip/${modalShare.clip.id_text}`,
      eyebrow: tFeatures("clip"),
    });
  }

  if (modalShare.item_chapter) {
    shareInputs.push({
      name: "chapter.chapter",
      value: `${WEB.origin}/chapter/${modalShare.item_chapter.id_text}`,
      eyebrow: tInfo("podcast.episode_chapter"),
    });
  }

  if (modalShare.item_soundbite) {
    shareInputs.push({
      name: "soundbite.official_clip",
      value: `${WEB.origin}/soundbite/${modalShare.item_soundbite.id_text}`,
      eyebrow: tInfo("podcast.episode_soundbite"),
    });
  }

  shareInputs.push({
    name: "embed",
    value: `TODO: add embed code here`,
    eyebrow: tFeatures("embed")
  });
  
  return (
    <Modal
      header={tFeatures("share")}
      isOpen={isOpen}
      onClose={() => setModalShare({ channel: null, item: null, clip: null, item_chapter: null, item_soundbite: null })}
      ariaLabel={tFeatures("share")}
      modalContentMaxWidth={500}>
      {shareInputs.map((input, idx) => (
        <TextInput
          key={input.name}
          type="text"
          name={input.name}
          value={input.value}
          eyebrow={input.eyebrow}
          button={{
            label: copiedIndex === idx ? tFeatures("copied") : tFeatures("copy"),
            onClick: () => handleCopy(input.value, idx)
          }}
          readOnly
        />
      ))}
    </Modal>
  )
}

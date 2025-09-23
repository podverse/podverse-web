"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { Modal } from "./Modal";
import { useModals } from "../../contexts/Modals";
import { ClipForm } from "../Clip/ClipForm";
import { SharableStatusEnum } from "podverse-helpers";

export const ModalClip: React.FC = () => {
  const tFeatures = useTranslations("features");
  const header = tFeatures("clip.create_clip");
  const { modalClip, setModalClip } = useModals();

  const [sharableStatus, setSharableStatus] = React.useState<string>(`${SharableStatusEnum.Private}`);
  const [title, setTitle] = React.useState<string>("");
  const [startTimeString, setStartTimeString] = React.useState<string>("");
  const [endTimeString, setEndTimeString] = React.useState<string>("");
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);

  if (!modalClip.channel || !modalClip.item) {
    return null;
  }

  const clearModalClip = () => {
    setModalClip({
      channel: null,
      item: null
    });
  }

  const onSubmit = async () => {
    setIsUpdating(true);
    alert("Hello");
    setTimeout(() => {
      setIsUpdating(false);
    }, 3000)
  }

  return (
    <Modal
      isOpen={!!modalClip.item}
      onClose={clearModalClip}
      header={header}
      ariaLabel={header}
      modalContentMaxWidth={500}>
      <ClipForm
        channel={modalClip.channel}
        item={modalClip.item}
        sharableStatus={sharableStatus}
        setSharableStatus={setSharableStatus}
        title={title}
        setTitle={setTitle}
        startTimeString={startTimeString}
        setStartTimeString={setStartTimeString}
        endTimeString={endTimeString}
        setEndTimeString={setEndTimeString}
        onSubmit={onSubmit}
        onCancel={clearModalClip}
        isUpdating={isUpdating}
      />
    </Modal>
  );
};
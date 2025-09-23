"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { Modal } from "./Modal";
import { useModals } from "../../contexts/Modals";
import { ClipForm } from "../Clip/ClipForm";
import { hhmmssToSecondsNumeric, SharableStatusEnum } from "podverse-helpers";
import { apiRequestService } from "../../factories/apiRequestService";

export const ModalClip: React.FC = () => {
  const tFeatures = useTranslations("features");
  const header = tFeatures("clip.create_clip");
  const { modalClip, setModalClip, setModalClipCreated } = useModals();

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
    setTitle("");
    setStartTimeString("");
    setEndTimeString("");
    setIsUpdating(false);
  }

  const onSubmit = async () => {
    if (modalClip.item?.id_text) {
      setIsUpdating(true);
      
      const finalTitle = title?.trim();
      const finalSharableStatusId = parseInt(sharableStatus, 10);
      const finalStartTime = hhmmssToSecondsNumeric(startTimeString);
      const finalEndTime = endTimeString ? hhmmssToSecondsNumeric(endTimeString) : null;

      const clip = await apiRequestService.reqClipCreate({
        item_id_text: modalClip.item.id_text,
        sharable_status_id: finalSharableStatusId,
        title: finalTitle.length > 0 ? finalTitle : null,
        start_time: finalStartTime,
        end_time: finalEndTime
      });
  
      setIsUpdating(false);
      clearModalClip();
      setModalClipCreated({ clip });
    }
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
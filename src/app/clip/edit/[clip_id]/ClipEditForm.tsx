"use client";

import { useRouter } from "next/navigation";
import { DTOClip, hhmmssToSecondsNumeric } from "podverse-helpers";
import React from "react";
import { useClipEditContext } from "./ClipEditContext";
import { apiRequestService } from "../../../../factories/apiRequestService";
import { ClipForm } from "../../../../components/Clip/ClipForm";

type ClipEditFormProps = {
  ssrClip: DTOClip;
}

export const ClipEditForm: React.FC<ClipEditFormProps> = ({ ssrClip }) => {
  const router = useRouter();
  const {
    sharableStatus, setSharableStatus,
    title, setTitle,
    startTimeString, setStartTimeString,
    endTimeString, setEndTimeString,
    isUpdating, setIsUpdating
   } = useClipEditContext();
  
  const onCancel = () => {
    router.push("/");
  }
  
  const onSubmit = async () => {
    setIsUpdating(true);

    const finalTitle = title?.trim();
    const finalSharableStatusId = parseInt(sharableStatus, 10);
    const finalStartTime = hhmmssToSecondsNumeric(startTimeString);
    const finalEndTime = endTimeString ? hhmmssToSecondsNumeric(endTimeString) : null;

    const clip = await apiRequestService.reqClipUpdate(ssrClip.id_text, {
      item_id_text: ssrClip.item.id_text,
      sharable_status_id: finalSharableStatusId,
      title: finalTitle,
      description: "",
      start_time: finalStartTime,
      end_time: finalEndTime
    });

    setIsUpdating(false);

    router.push(`/clip/${clip.id_text}`);
  }

  return (
    <ClipForm
      channel={ssrClip.item.channel!}
      item={ssrClip.item}
      sharableStatus={sharableStatus}
      setSharableStatus={setSharableStatus}
      title={title}
      setTitle={setTitle}
      startTimeString={startTimeString}
      setStartTimeString={setStartTimeString}
      endTimeString={endTimeString}
      setEndTimeString={setEndTimeString}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isUpdating={isUpdating}
      edit_clip_id_text={ssrClip.id_text}
    />
  );
};

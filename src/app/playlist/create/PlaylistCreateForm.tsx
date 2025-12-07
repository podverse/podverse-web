"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { getQueryParamFromQueueMediumId } from "podverse-helpers";
import React from "react";
import { usePlaylistCreateContext } from "./PlaylistCreateContext";
import { apiRequestService } from "../../../factories/apiRequestService";
import { PlaylistForm } from "../../../components/Playlist/PlaylistForm";
import { SHARABLE_STATUS } from "../../../constants/sharableStatus";
import { MEDIUM } from "../../../constants/medium";

export const PlaylistCreateForm: React.FC = () => {
  const tMedia = useTranslations("media");
  const tFeatures = useTranslations("features");
  const tMisc = useTranslations("misc");
  const router = useRouter();
  const { medium, setMedium, title, setTitle, description, setDescription,
    sharableStatus, setSharableStatus, isUpdating, setIsUpdating
   } = usePlaylistCreateContext();

  const mediumDropdownMenuItems = MEDIUM.menuItems(tMedia);
  const sharableStatusDropdownMenuItems = SHARABLE_STATUS.menuItems(tMisc);

  const onCancel = () => {
    router.push("/");
  }

  const onSubmit = async () => {
    setIsUpdating(true);

    const playlist = await apiRequestService.reqPlaylistCreate({
      title,
      description,
      medium: getQueryParamFromQueueMediumId(Number(medium)),
      sharable_status_id: Number(sharableStatus)
    })

    setIsUpdating(false);

    router.push(`/playlist/${playlist.id_text}`);
  }

  const isValidSubmit = () => {
    return !isUpdating && title.trim().length > 0;
  }

  return (
    <PlaylistForm
      medium={medium}
      setMedium={setMedium}
      mediumDropdownMenuItems={mediumDropdownMenuItems}
      sharableStatus={sharableStatus}
      setSharableStatus={setSharableStatus}
      sharableStatusDropdownMenuItems={sharableStatusDropdownMenuItems}
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      isUpdating={isUpdating}
      onCancel={onCancel}
      onSubmit={onSubmit}
      isValidSubmit={isValidSubmit}
      tFeatures={tFeatures}
      tMisc={tMisc}
    />
  );
};

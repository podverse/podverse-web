"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { DTOPlaylist, MediumEnum, SharableStatusEnum } from "podverse-helpers";
import React from "react";
import { usePlaylistEditContext } from "./PlaylistEditContext";
import { apiRequestService } from "../../../../factories/apiRequestService";
import { PlaylistForm } from "../../../../components/Playlist/PlaylistForm";

type PlaylistEditFormProps = {
  ssrPlaylist: DTOPlaylist;
}

export const PlaylistEditForm: React.FC<PlaylistEditFormProps> = ({ ssrPlaylist }) => {
  const tMedia = useTranslations("media");
  const tFeatures = useTranslations("features");
  const tMisc = useTranslations("misc");
  const router = useRouter();
  const { medium, setMedium, title, setTitle, description, setDescription,
    sharableStatus, setSharableStatus, isUpdating, setIsUpdating
   } = usePlaylistEditContext();

  const mediumDropdownMenuItems = [
    { label: tMedia("podcast.podcast"), param: "medium", value: `${MediumEnum.Podcast}` },
    { label: tMedia("video.video"), param: "medium", value: `${MediumEnum.Video}` },
    { label: tMedia("music.music"), param: "medium", value: `${MediumEnum.Music}` },
    { label: tMedia("mixed"), param: "medium", value: `${MediumEnum.Mixed}` },
  ];

  const sharableStatusDropdownMenuItems = [
    { label: tMisc("sharable_status.public"), param: "sharable_status", value: `${SharableStatusEnum.Public}` },
    { label: tMisc("sharable_status.unlisted"), param: "sharable_status", value: `${SharableStatusEnum.Unlisted}` },
    { label: tMisc("sharable_status.private"), param: "sharable_status", value: `${SharableStatusEnum.Private}` },
  ];

  const onCancel = () => {
    router.push("/");
  }
  
  const onSubmit = async () => {
    setIsUpdating(true);

    const playlist = await apiRequestService.reqPlaylistEdit({
      id_text: ssrPlaylist.id_text,
      title,
      description,
      medium_id: Number(medium),
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
      showIdText={true}
      idText={ssrPlaylist.id_text}
    />
  );
};

"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { DTOPlaylist, MediumEnum, SharableStatusEnum } from "podverse-helpers";
import React from "react";
import Form from "../../../../components/Form/Form";
import { TextInput } from "../../../../components/Form/TextInput";
import { usePlaylistEditContext } from "./PlaylistEditContext";
import { TextArea } from "../../../../components/Form/TextArea";
import { Button } from "../../../../components/Button/Button";
import { FormDropdown } from "../../../../components/Form/FormDropdown";
import { apiRequestService } from "../../../../factories/apiRequestService";
import styles from "../../../../styles/app/playlist/edit/PlaylistEditForm.module.scss";

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
    <Form className={styles.form} onSubmit={onSubmit}>
      <TextInput
        type="text"
        name="id_text"
        value={ssrPlaylist.id_text}
        disabled
        eyebrow={tMisc("id")}
      />
      <FormDropdown
        key="medium"
        eyebrow={tFeatures("playlist.playlist_type")}
        value={`${medium}`}
        menuItems={mediumDropdownMenuItems}
        onChange={(val) => setMedium(val)}
      />
      <FormDropdown
        key="sharable_status"
        eyebrow={tMisc("sharable_status.sharable_status")}
        value={`${sharableStatus}`}
        menuItems={sharableStatusDropdownMenuItems}
        onChange={(val) => setSharableStatus(val)}
      />
      <TextInput
        type="text"
        name="title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        autoFocus
        placeholder={tMisc("required")}
        eyebrow={tMisc("title")}
      />
      <TextArea
        eyebrow={tMisc("description")}
        name="description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder={tMisc("optional")}
        rows={3}
      />
      <div className={styles.buttons}>
        <Button
          variant="secondary"
          type="button"
          onClick={onCancel}
        >
          {tMisc("cancel")}
        </Button>
        <Button
          variant="primary"
          type="button"
          disabled={!isValidSubmit()}
          onClick={onSubmit}
          isLoading={isUpdating}>
          {tMisc("submit")}
        </Button>
      </div>
    </Form>
  );
};

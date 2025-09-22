"use client";

import { useTranslations } from "next-intl";
import { MediumEnum, SharableStatusEnum } from "podverse-helpers";
import React from "react";
import Form from "../../../components/Form/Form";
import { TextInput } from "../../../components/Form/TextInput";
import { usePlaylistCreateContext } from "./PlaylistCreateContext";
import styles from "../../../styles/app/playlist/create/PlaylistCreateForm.module.scss";
import { TextArea } from "../../../components/Form/TextArea";
import { Button } from "../../../components/Button/Button";
import { FormDropdown } from "../../../components/Form/FormDropdown";

export const PlaylistCreateForm: React.FC = () => {
  const tMedia = useTranslations("media");
  const tFeatures = useTranslations("features");
  const tMisc = useTranslations("misc");
  const { medium, setMedium, title, setTitle, description, setDescription,
    sharableStatus, setSharableStatus
   } = usePlaylistCreateContext();

  const onSubmit = () => {
    console.log("submit");
  }

  const isValidSubmit = () => {
    return title.trim().length > 0;
  }

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

  return (
    <Form className={styles.form} onSubmit={onSubmit}>
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
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder={tMisc("optional")}
        rows={3}
      />
      <div className={styles.buttons}>
        <Button
          variant="secondary"
          type="button">
          {tMisc("cancel")}
        </Button>
        <Button
          variant="primary"
          type="button"
          disabled={!isValidSubmit()}
          onClick={onSubmit}>
          {tMisc("submit")}
        </Button>
      </div>
    </Form>
  );
};

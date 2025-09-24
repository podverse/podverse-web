"use client";

import React from "react";
import { FormDropdown } from "../../components/Form/FormDropdown";
import { TextInput } from "../../components/Form/TextInput";
import { TextArea } from "../../components/Form/TextArea";
import { Button } from "../../components/Button/Button";
import Form from "../../components/Form/Form";
import styles from "../../styles/components/Playlist/PlaylistForm.module.scss";
import Divider from "../Divider/Divider";
import { apiRequestService } from "../../factories/apiRequestService";
import { useRouter } from "next/navigation";

export type PlaylistFormProps = {
  medium: string;
  setMedium: (val: string) => void;
  mediumDropdownMenuItems: any[];
  sharableStatus: string;
  setSharableStatus: (val: string) => void;
  sharableStatusDropdownMenuItems: any[];
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  isUpdating: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  isValidSubmit: () => boolean;
  tFeatures: any;
  tMisc: any;
  edit_playlist_id_text?: string;
  className?: string;
};

export const PlaylistForm: React.FC<PlaylistFormProps> = ({
  medium,
  setMedium,
  mediumDropdownMenuItems,
  sharableStatus,
  setSharableStatus,
  sharableStatusDropdownMenuItems,
  title,
  setTitle,
  description,
  setDescription,
  isUpdating,
  onCancel,
  onSubmit,
  isValidSubmit,
  tFeatures,
  tMisc,
  edit_playlist_id_text = ""
}) => {
  const router = useRouter();

  const handleDelete = async () => {
    if (
      edit_playlist_id_text &&
      window.confirm(tFeatures("playlist.delete_playlist_confirm"))
    ) {
      await apiRequestService.reqPlaylistDelete(edit_playlist_id_text);
      router.push("/playlists");
    }
  }

  return (
    <Form className={styles.form} onSubmit={onSubmit}>
      {edit_playlist_id_text && (
        <TextInput
          type="text"
          name="id_text"
          value={edit_playlist_id_text}
          disabled
          eyebrow={tMisc("id")}
        />
      )}
      <FormDropdown
        key="medium"
        eyebrow={tFeatures("playlist.playlist_type")}
        value={`${medium}`}
        menuItems={mediumDropdownMenuItems}
        onChange={setMedium}
      />
      <FormDropdown
        key="sharable_status"
        eyebrow={tMisc("sharable_status.sharable_status")}
        value={`${sharableStatus}`}
        menuItems={sharableStatusDropdownMenuItems}
        onChange={setSharableStatus}
      />
      <TextInput
        type="text"
        name="title"
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        autoFocus
        placeholder={tMisc("required")}
        eyebrow={tMisc("title")}
      />
      <TextArea
        eyebrow={tMisc("description")}
        name="description"
        value={description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
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
          isLoading={isUpdating}
        >
          {tMisc("submit")}
        </Button>
      </div>
      {
        edit_playlist_id_text && (
          <div className={styles.bottomSection}>
            <Divider />
            <div className={styles.bottomSectionButtons}>
              <Button
                variant="danger"
                type="button"
                onClick={handleDelete}
              >
                {tFeatures("playlist.delete_playlist")}
              </Button>
            </div>
          </div>
        )
      }
    </Form>
  );
};

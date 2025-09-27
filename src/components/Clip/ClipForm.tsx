"use client";

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation";
import { DTOChannel, DTOItem, hhmmssToSecondsNumber } from "podverse-helpers"
import Form from "../Form/Form"
import styles from "../../styles/components/Clip/ClipForm.module.scss"
import { MediaHeaderMini } from "../MediaHeaderMini/MediaHeaderMini"
import { FormDropdown } from "../Form/FormDropdown"
import { SHARABLE_STATUS } from "../../constants/sharableStatus"
import { TextInput } from "../Form/TextInput"
import { TextInputHHMMSS } from "../Form/TextInputHHMMSS"
import { ClipEditorPlayer } from "./ClipEditorPlayer"
import { Button } from "../Button/Button"
import { EVENTS } from "../../constants/events"
import { useMediaPlayer } from "../../contexts/MediaPlayer"
import { Divider } from "../Divider/Divider";
import { apiRequestService } from "../../factories/apiRequestService";

type ClipFormProps = {
  channel: DTOChannel;
  item: DTOItem;
  sharableStatus: string;
  setSharableStatus: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  startTimeString: string;
  setStartTimeString: (val: string) => void;
  endTimeString?: string | null;
  setEndTimeString: (val: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isUpdating?: boolean;
  edit_clip_id_text?: string;
}

export const ClipForm: React.FC<ClipFormProps> = ({ channel, item, onSubmit, sharableStatus,
  setSharableStatus, title, setTitle, startTimeString, setStartTimeString, endTimeString,
  setEndTimeString, onCancel, isUpdating, edit_clip_id_text }) => {
  const { setMPIsPlaying } = useMediaPlayer();
  const tFeatures = useTranslations("features")
  const tMisc = useTranslations("misc");
  const router = useRouter();

  const sharableStatusDropdownMenuItems = SHARABLE_STATUS.menuItems(tMisc);

  const isValidSubmit = () => {
    return startTimeString?.length > 0;
  }

  const startTimeOnButtonClick = () => {
    window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.AUDIO.SEEK, {
      detail: { time: hhmmssToSecondsNumber(startTimeString) }
    }));
    setMPIsPlaying(true);
  }

  const endTimeOnButtonClick = () => {
    if (endTimeString) {
      const endTimeInSeconds = hhmmssToSecondsNumber(endTimeString)
      const seekTime = endTimeInSeconds > 3 ? endTimeInSeconds - 3 : 0;
      window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.AUDIO.SEEK, {
        detail: { time: seekTime }
      }));
      window.dispatchEvent(new CustomEvent(EVENTS.MEDIA_PLAYER.AUDIO.PAUSE_AT, {
        detail: { stopAt: endTimeInSeconds }
      }));
      setMPIsPlaying(true);
    }
  }

  const handleDelete = async () => {
    if (
      edit_clip_id_text &&
      window.confirm(tFeatures("clip.delete_clip_confirm"))
    ) {
      await apiRequestService.reqClipDelete(edit_clip_id_text);
      router.push("/clips");
    }
  }

  return (
    <Form
      className={styles.form}
      onSubmit={onSubmit}>
      <MediaHeaderMini
        channel={channel}
        item={item}
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
        placeholder={tMisc("optional")}
        eyebrow={tMisc("title")}
      />
      <div className={styles.timeInputs}>
        <TextInputHHMMSS
          value={startTimeString}
          onChange={(val) => setStartTimeString(val)}
          eyebrow={tFeatures("clip.start_time")}
          name="start_time"
          placeholder="00:00"
          aria-label={tFeatures("clip.start_time_aria")}
          onButtonClick={startTimeOnButtonClick}
          buttonAriaLabel={tFeatures("clip.start_time_play_aria")}
        />
        <TextInputHHMMSS
          value={endTimeString || ""}
          onChange={(val) => setEndTimeString(val)}
          eyebrow={tFeatures("clip.end_time")}
          name="end_time"
          placeholder={tMisc("optional")}
          aria-label={tFeatures("clip.end_time_aria")}
          onButtonClick={endTimeOnButtonClick}
          buttonAriaLabel={tFeatures("clip.end_time_play_aria")}
        />
      </div>
      <ClipEditorPlayer
        startTime={startTimeString ? hhmmssToSecondsNumber(startTimeString) : null}
        endTime={endTimeString ? hhmmssToSecondsNumber(endTimeString) : null}
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
        edit_clip_id_text && (
          <div className={styles.bottomSection}>
            <Divider />
            <div className={styles.bottomSectionButtons}>
              <Button
                variant="danger"
                type="button"
                onClick={handleDelete}
              >
                {tFeatures("clip.delete_clip")}
              </Button>
            </div>
          </div>
        )
      }
    </Form>
  )

}

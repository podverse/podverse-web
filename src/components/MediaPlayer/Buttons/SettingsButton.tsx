"use client";

import { buildLabeledItemEnclosures, getNextPlaybackSpeed, getPlaybackTranslationKey } from "podverse-helpers";
import { useRef } from "react";
import { FaGear } from "react-icons/fa6"
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { DropdownMenu } from "../../Dropdown/DropdownMenu";
import { ROUTES } from "../../../constants/routes";
import { useDropdownKeyboardNavigation } from "../../../hooks/useDropdownKeyboardNavigation";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { useEnclosureLabel } from "../../../utils/itemEnclosure";
import styles from "../../../styles/components/MediaPlayer/Buttons/SettingsButton.module.scss";

export const SettingsButton = () => {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const { mpItem, mpPlaybackSpeed, setMPPlaybackSpeed, mpEnclosureRowSelected } = useMediaPlayer();
  const tMediaPlayer = useTranslations("media_player");

  const playbackSpeedOnClick = () => {
    setMPPlaybackSpeed(getNextPlaybackSpeed(mpPlaybackSpeed));
  };

  const labeledItemEnclosures = buildLabeledItemEnclosures(mpItem?.item_enclosures || []);

  const selectedEnclosure = (mpEnclosureRowSelected != null && labeledItemEnclosures[mpEnclosureRowSelected])
    ? labeledItemEnclosures[0]
    : undefined;

  const enclosureLabel = useEnclosureLabel(selectedEnclosure);

  const menuItems = [
    { label: tMediaPlayer('source.source_with_format', { format: enclosureLabel ?? '' }), onClick: () => {} },
    {
      label: tMediaPlayer(
        'playback_speed.playback_speed_with_value',
        { speed: tMediaPlayer(`playback_speed.speeds.${getPlaybackTranslationKey(mpPlaybackSpeed)}`) }
      ),
      onClick: playbackSpeedOnClick
    }
  ];

  const {
    open,
    setOpen,
    focusedIndex,
    setFocusedIndex,
    handleButtonKeyDown,
    handleMenuKeyDown,
  } = useDropdownKeyboardNavigation({
    itemCount: menuItems.length,
    onItemSelect: (idx) => menuItems[idx]?.onClick(),
    onClose: () => setOpen(false),
    buttonRef,
    menuRef,
  });

  return (
    <div className={styles.settingsDropdownWrapper}>
      <button
        ref={buttonRef}
        className={styles.settingsButton}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleButtonKeyDown}
        type="button">
        <FaGear />
      </button>
      <DropdownMenu
        menuItems={menuItems}
        open={open}
        menuRef={menuRef}
        focusedIndex={focusedIndex}
        setFocusedIndex={setFocusedIndex}
        handleMenuKeyDown={handleMenuKeyDown}
        setOpen={setOpen}
        verticalPosition="above"
      />
    </div>
  )
}

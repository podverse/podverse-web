"use client";

import { getNextPlaybackSpeed, getPlaybackTranslationKey, getSelectedLabeledItemEnclosureAndSource } from "podverse-helpers";
import { useRef } from "react";
import { FaGear } from "react-icons/fa6"
import { useTranslations } from "next-intl";
import { DropdownMenu } from "../../Dropdown/DropdownMenu";
import { useDropdownKeyboardNavigation } from "../../../hooks/useDropdownKeyboardNavigation";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import { useEnclosureLabel } from "../../../utils/itemEnclosure";
import styles from "../../../styles/components/MediaPlayer/Buttons/SettingsButton.module.scss";
import { useModals } from "../../../contexts/Modals";

export const SettingsButton = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const { mpPlaybackSpeed, setMPPlaybackSpeed, mpEnclosureSelectedParams,
    mpItemLabeledItemEnclosures, mpItem } = useMediaPlayer();
  const { setModalSourceSelector } = useModals();
  const tMediaPlayer = useTranslations("media_player");

  const playbackSpeedOnClick = () => {
    setMPPlaybackSpeed(getNextPlaybackSpeed(mpPlaybackSpeed));
  };

  const selectedItemEnclosureAndSource = getSelectedLabeledItemEnclosureAndSource({
    labeledItemEnclosures: mpItemLabeledItemEnclosures,
    type: mpEnclosureSelectedParams.type,
    enclosureRowIndex: mpEnclosureSelectedParams.enclosureRowSelected,
    sourceRowIndex: mpEnclosureSelectedParams.sourceRowSelected
  });

  const enclosureLabel = useEnclosureLabel(selectedItemEnclosureAndSource.labeledItemEnclosure);

  const menuItems: { label: string; onClick: () => void }[] = [];

  if (mpItemLabeledItemEnclosures.length > 1) {
    menuItems.push({
      label: tMediaPlayer('source.source_with_format', { format: enclosureLabel ?? '' }),
      onClick: () => {
        setModalSourceSelector({
          labeledItemEnclosures: mpItemLabeledItemEnclosures,
          actionType: "load-in-player",
          itemTitle: mpItem?.title || null
        });
      }
    });
  }

  menuItems.push({
    label: tMediaPlayer(
      'playback_speed.playback_speed_with_value',
      { speed: tMediaPlayer(`playback_speed.speeds.${getPlaybackTranslationKey(mpPlaybackSpeed)}`) }
    ),
    onClick: playbackSpeedOnClick
  })

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

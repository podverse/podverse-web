"use client";

import React, { useRef } from "react";
import styles from "../../styles/components/MoreButton/MoreButton.module.scss";
import DropdownMenu from "../Dropdown/DropdownMenu";
import { useDropdownKeyboardNavigation } from "../../hooks/useDropdownKeyboardNavigation";
import { FaEllipsisH } from "react-icons/fa";

export interface MoreButtonMenuItem {
  label: string;
  onClick: () => void;
}

export interface MoreButtonProps {
  moreButtonMenuItems: MoreButtonMenuItem[];
};

const MoreButton: React.FC<MoreButtonProps> = ({
  moreButtonMenuItems
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const {
    open,
    setOpen,
    focusedIndex,
    setFocusedIndex,
    handleButtonKeyDown,
    handleMenuKeyDown,
  } = useDropdownKeyboardNavigation({
    itemCount: moreButtonMenuItems.length,
    onItemSelect: (idx) => moreButtonMenuItems[idx]?.onClick(),
    onClose: () => setOpen(false),
    buttonRef,
    menuRef,
  });

  return (
    <div className={styles.dropdown}>
      <button
        ref={buttonRef}
        className={styles.button}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={e => handleButtonKeyDown(e)}
        type="button"
      >
        <FaEllipsisH />
      </button>
      <DropdownMenu
        menuItems={moreButtonMenuItems}
        open={open}
        menuRef={menuRef}
        focusedIndex={focusedIndex}
        setFocusedIndex={setFocusedIndex}
        handleMenuKeyDown={handleMenuKeyDown}
        setOpen={setOpen}
        position="right"
      />
    </div>
  );
};

export default MoreButton;

"use client";

import React, { useRef, useMemo } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { DropdownMenu } from "../Dropdown/DropdownMenu";
import { useDropdownKeyboardNavigation } from "../../hooks/useDropdownKeyboardNavigation";
import { DropdownMenuItem } from "../Dropdown/Dropdown";
import styles from "../../styles/components/Form/FormDropdown.module.scss";

export interface FormDropdownProps {
  eyebrow?: string;
  id: string;
  label?: string;
  menuItems: DropdownMenuItem[];
  value: string;
  onChange: (value: string) => void;
};

export const FormDropdown: React.FC<FormDropdownProps> = ({
  eyebrow,
  id,
  label,
  menuItems,
  value,
  onChange
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const currentSelectedItem = useMemo(() => {
    return menuItems.find(item => item.value === value) || menuItems[0];
  }, [menuItems, value]);

  const menuItemsWithHandlers = menuItems.map((item) => ({
    label: item.label,
    onClick: () => {
      if (item.value !== value) {
        onChange(item.value);
      }
    },
  }));
  
  const {
    open,
    setOpen,
    focusedIndex,
    setFocusedIndex,
    handleButtonKeyDown,
    handleMenuKeyDown,
  } = useDropdownKeyboardNavigation({
    itemCount: menuItemsWithHandlers.length,
    onItemSelect: (idx) => menuItemsWithHandlers[idx]?.onClick(),
    onClose: () => setOpen(false),
    buttonRef,
    menuRef,
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      </div>
      <div className={styles.dropdownWrapper}>
        <div className={styles.dropdownInnerWrapper}>
          {eyebrow && (
            <label className={styles.eyebrow}>
              {eyebrow}
            </label>
          )}
          <button
            ref={buttonRef}
            id={id}
            className={styles.dropdownButton}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            onKeyDown={e => handleButtonKeyDown(e)}
            type="button"
            >
            <div className={styles.dropdown}>
              <span className={styles.dropdownSelectedItemText}>{currentSelectedItem?.label}</span>
              <FaChevronDown />
            </div>
          </button>
        </div>
      </div>
      <DropdownMenu
        menuItems={menuItemsWithHandlers}
        open={open}
        menuRef={menuRef}
        focusedIndex={focusedIndex}
        setFocusedIndex={setFocusedIndex}
        handleMenuKeyDown={handleMenuKeyDown}
        setOpen={setOpen}
        position="left"
        fullWidth
      />
    </div>
  );
};

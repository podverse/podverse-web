"use client";

import React, { useRef, useMemo } from "react";
import styles from "../../styles/components/Dropdown/Dropdown.module.scss";
import DropdownMenu from "./DropdownMenu";
import { useDropdownKeyboardNavigation } from "../../hooks/useDropdownKeyboardNavigation";
import { Button } from "../Button/Button";

export interface MenuItem {
  label: string;
  param: string;
  value: string;
}

export interface DropdownProps {
  menuItems: MenuItem[];
  value: string;
  onChange: (value: string) => void;
  position?: "left" | "right";
};

const Dropdown: React.FC<DropdownProps> = ({
  menuItems,
  value,
  onChange,
  position
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

  const hasMoreThanOneOption = menuItemsWithHandlers.length > 1;

  return (
    <div className={styles.dropdown}>
      <Button
        ref={buttonRef}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => hasMoreThanOneOption && setOpen((v) => !v)}
        onKeyDown={e => hasMoreThanOneOption && handleButtonKeyDown(e)}
        type="button"
        variant="miniPrimary"
        isDropdownButton={hasMoreThanOneOption}
      >
        {currentSelectedItem?.label}
      </Button>
      <DropdownMenu
        menuItems={menuItemsWithHandlers}
        open={open}
        menuRef={menuRef}
        focusedIndex={focusedIndex}
        setFocusedIndex={setFocusedIndex}
        handleMenuKeyDown={handleMenuKeyDown}
        setOpen={setOpen}
        position={position}
      />
    </div>
  );
};

export default Dropdown;
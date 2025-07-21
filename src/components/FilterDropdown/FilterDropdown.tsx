"use client";

import classNames from "classnames";
import React, { useRef, useMemo } from "react";
import { FaChevronDown } from "react-icons/fa";
import styles from "../../styles/components/FilterDropdown/FilterDropdown.module.scss";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import { useDropdownKeyboardNavigation } from "../../hooks/useDropdownKeyboardNavigation";

export interface MenuItem {
  label: string;
  param: string;
  value: string;
}

export interface FilterDropdownProps {
  menuItems: MenuItem[];
  value: string;
  onChange: (value: string) => void;
  type?: 'primary' | 'secondary';
};

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  menuItems,
  value,
  onChange,
  type = 'primary',
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
    <div className={styles.dropdownWrapper}>
      <button
        ref={buttonRef}
        className={classNames(styles.button, {
          [styles.buttonSecondary]: type === 'secondary',
        })}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => hasMoreThanOneOption && setOpen((v) => !v)}
        onKeyDown={e => hasMoreThanOneOption && handleButtonKeyDown(e)}
        type="button"
      >
        <span className={styles.buttonLabel}>{currentSelectedItem?.label}</span>
        {hasMoreThanOneOption && (
          <FaChevronDown className={styles.chevronIcon} />
        )}
      </button>
      <DropdownMenu
        menuItems={menuItemsWithHandlers}
        open={open}
        menuRef={menuRef}
        focusedIndex={focusedIndex}
        setFocusedIndex={setFocusedIndex}
        handleMenuKeyDown={handleMenuKeyDown}
        setOpen={setOpen}
      />
    </div>
  );
};

export default FilterDropdown;
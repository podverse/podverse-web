"use client";

import React, { useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";
import styles from "../../styles/components/FilterDropdown/FilterDropdown.module.scss";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import { useDropdownKeyboardNavigation } from "../../hooks/useDropdownKeyboardNavigation";

interface MenuItem {
  label: string;
  param: string;
  value: string;
}

interface FilterDropdownProps {
  menuItems: MenuItem[];
  selectedKey?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  menuItems
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSelectedItem = useMemo(() => {
    for (const item of menuItems) {
      if (searchParams.get(item.param) === item.value) {
        return item;
      }
    }
    
    return menuItems[0];
  }, [menuItems, searchParams]);

  const menuItemsWithHandlers = menuItems.map((item) => ({
    label: item.label,
    onClick: () => {
      const params = new URLSearchParams(searchParams.toString());
      menuItems.forEach(mi => params.delete(mi.param));
      params.delete("page");
      params.set(item.param, item.value);
      router.push(`${window.location.pathname}?${params.toString()}`);
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
    <div className={styles.dropdownWrapper}>
      <button
        ref={buttonRef}
        className={styles.button}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleButtonKeyDown}
        type="button"
      >
        <span className={styles.buttonLabel}>{currentSelectedItem?.label}</span>
        <FaChevronDown className={styles.chevronIcon} />
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
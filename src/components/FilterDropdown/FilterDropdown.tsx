"use client";

import classNames from "classnames";
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
  defaultValue: string;
  type?: 'primary' | 'secondary';
  clearOtherParams?: boolean;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  menuItems,
  defaultValue,
  type = 'primary',
  clearOtherParams = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const currentSelectedItem = useMemo(() => {
    for (const item of menuItems) {
      const paramValue = searchParams.get(item.param);
      if (paramValue === item.value) {
        return item;
      }
    }
    const defaultItem = menuItems.find(item => item.value === defaultValue) || menuItems[0];
    return defaultItem;
  }, [menuItems, searchParams, defaultValue]);

  const menuItemsWithHandlers = menuItems.map((item) => ({
  label: item.label,
  onClick: () => {
    let params: URLSearchParams;
    if (clearOtherParams) {
      params = new URLSearchParams();
      if (item.value !== defaultValue) {
        params.set(item.param, item.value);
      }
    } else {
      params = new URLSearchParams(searchParams.toString());
      menuItems.forEach(mi => params.delete(mi.param));
      params.delete("page");
      if (item.value !== defaultValue) {
        params.set(item.param, item.value);
      } else {
        params.delete(item.param);
      }
    }
    const queryString = params.toString();
    const url = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    router.push(url);
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
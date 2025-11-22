"use client";

import { FaGear } from "react-icons/fa6";
import styles from "../../styles/components/ViewSelector/ViewSelector.module.scss";
import { useTranslations } from "next-intl";
import React, { useRef } from "react";
import { DropdownMenu } from "../Dropdown/DropdownMenu";
import { useDropdownKeyboardNavigation } from "../../hooks/useDropdownKeyboardNavigation";

export type ViewSelectedOption = "grid" | "grid-mini" | "rows";

type ViewSelectorProps = {
  viewSelected: ViewSelectedOption;
  setViewSelected: (view: ViewSelectedOption) => void;
};

export function ViewSelector({ viewSelected, setViewSelected }: ViewSelectorProps) {
  const tLayouts = useTranslations("layouts");

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const viewOptions: { key: ViewSelectorProps['viewSelected']; label: string }[] = [
    { key: "grid", label: tLayouts("grid_view") },
    { key: "grid-mini", label: tLayouts("grid_mini_view") },
    { key: "rows", label: tLayouts("list_view") }
  ];

  const menuItems = viewOptions.map(({ key, label }) => ({
    label: `${viewSelected === key ? "✓ " : ""}${label}`,
    onClick: () => setViewSelected(key)
  }));

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
    <div className={styles.viewSelectorWrapper}>
      <button
        ref={buttonRef}
        className={styles.viewSelector}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={tLayouts("change_layout_view")}
        title={tLayouts("change_layout_view")}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleButtonKeyDown}
        type="button"
      >
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
        position="right"
      />
    </div>
  );
}

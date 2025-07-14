import React, { RefObject } from "react";
import styles from "../../styles/components/DropdownMenu/DropdownMenu.module.scss";

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface DropdownMenuProps {
  menuItems: MenuItem[];
  open: boolean;
  menuRef: RefObject<HTMLUListElement | null>;
  focusedIndex: number;
  setFocusedIndex: (idx: number) => void;
  handleMenuKeyDown: (e: React.KeyboardEvent) => void;
  setOpen: (open: boolean) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  menuItems,
  open,
  menuRef,
  focusedIndex,
  setFocusedIndex,
  handleMenuKeyDown,
  setOpen,
}) => {
  if (!open) return null;

  return (
    <ul
      className={styles.dropdownMenu}
      role="menu"
      tabIndex={-1}
      ref={menuRef}
      onKeyDown={handleMenuKeyDown}
    >
      {menuItems.map((item, idx) => (
        <li
          key={item.label}
          role="menuitem"
          tabIndex={-1}
          className={styles.menuItem}
          onClick={() => {
            item.onClick();
            setOpen(false);
          }}
          onMouseEnter={() => setFocusedIndex(idx)}
          aria-selected={focusedIndex === idx}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
};

export default DropdownMenu;
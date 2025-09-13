import React, { RefObject } from "react";
import styles from "../../styles/components/Dropdown/DropdownMenu.module.scss";

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
}

interface DropdownMenuProps {
  menuItems: DropdownMenuItem[];
  open: boolean;
  menuRef: RefObject<HTMLUListElement | null>;
  focusedIndex: number;
  setFocusedIndex: (idx: number) => void;
  handleMenuKeyDown: (e: React.KeyboardEvent) => void;
  setOpen: (open: boolean) => void;
  position?: "left" | "right";
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  menuItems,
  open,
  menuRef,
  focusedIndex,
  setFocusedIndex,
  handleMenuKeyDown,
  setOpen,
  position,
}) => {
  if (!open) return null;

  const positionStyle =
    position === "left"
      ? { left: 0 }
      : position === "right"
      ? { right: 0 }
      : { right: 0 };

  return (
    <ul
      className={styles.dropdownMenu}
      role="menu"
      tabIndex={-1}
      ref={menuRef}
      onKeyDown={handleMenuKeyDown}
      style={positionStyle}
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
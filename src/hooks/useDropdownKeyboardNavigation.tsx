import { useEffect, useState, RefObject } from "react";

interface UseDropdownKeyboardNavigationProps {
  itemCount: number;
  onItemSelect: (index: number) => void;
  onClose: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
  menuRef: RefObject<HTMLUListElement | null>;
}

export function useDropdownKeyboardNavigation({
  itemCount,
  onItemSelect,
  onClose,
  buttonRef,
  menuRef,
}: UseDropdownKeyboardNavigationProps) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, buttonRef, menuRef]);

  if (!buttonRef || !menuRef) {
    return {
      open: false,
      setOpen: () => {},
      focusedIndex: -1,
      setFocusedIndex: () => {},
      handleButtonKeyDown: () => {},
      handleMenuKeyDown: () => {},
    };
  }

  useEffect(() => {
    if (open && menuRef.current) {
      menuRef.current.focus();
    }
  }, [open, menuRef]);

  useEffect(() => {
    if (open && menuRef.current && focusedIndex >= 0) {
      const item = menuRef.current.children[focusedIndex] as HTMLElement;
      item?.focus();
    }
  }, [focusedIndex, open, menuRef]);

  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      setOpen(true);
      setFocusedIndex(0);
      e.preventDefault();
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      setFocusedIndex((i) => (i + 1) % itemCount);
    } else if (e.key === "ArrowUp") {
      setFocusedIndex((i) => (i - 1 + itemCount) % itemCount);
    } else if (e.key === "Tab") {
      setOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      onItemSelect(focusedIndex);
      setOpen(false);
    }
  };

  return {
    open,
    setOpen,
    focusedIndex,
    setFocusedIndex,
    handleButtonKeyDown,
    handleMenuKeyDown,
  };
}
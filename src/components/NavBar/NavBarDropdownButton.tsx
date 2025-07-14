"use client";

import React, { useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaChevronDown, FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import styles from "../../styles/components/NavBar/NavBarDropdownButton.module.scss";
import { AccountContext } from "../../contexts/Account";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import { useDropdownKeyboardNavigation } from "../../hooks/useDropdownKeyboardNavigation";
import { ROUTES } from "../../constants/routes";
import { useModals } from '../../contexts/Modals'

const NavBarDropdownButton: React.FC = () => {
  const { isLoggedIn } = useContext(AccountContext);
  const { openModal } = useModals();
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const menuItems = [
    { label: "My Profile", onClick: () => router.push(ROUTES.MY_PROFILE) },
    { label: "Membership", onClick: () => router.push(ROUTES.MEMBERSHIP) },
    { label: "Settings", onClick: () => router.push(ROUTES.SETTINGS) },
    { label: "Login", onClick: () => openModal('LoginModal') }
  ];

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
    <div className={styles.dropdownWrapper}>
      <button
        ref={buttonRef}
        className={styles.button}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleButtonKeyDown}
      >
        {isLoggedIn ? (
          <FaUserCircle className={styles.profileIcon} />
        ) : (
          <FaRegUserCircle className={styles.profileIcon} />
        )}
        <FaChevronDown />
      </button>
      <DropdownMenu
        menuItems={menuItems}
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

export default NavBarDropdownButton;
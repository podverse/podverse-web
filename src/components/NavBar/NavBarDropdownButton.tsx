"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { FaChevronDown, FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import styles from "../../styles/components/NavBar/NavBarDropdownButton.module.scss";
import { useAccount } from "../../contexts/Account";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import { useDropdownKeyboardNavigation } from "../../hooks/useDropdownKeyboardNavigation";
import { ROUTES } from "../../constants/routes";
import { useModals } from '../../contexts/Modals'
import { apiRequestService } from "../../factories/apiRequestService";

const NavBarDropdownButton: React.FC = () => {
  const { loggedInAccount } = useAccount();
  const { openModal } = useModals();
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  async function handleLogout() {
    await apiRequestService.reqAuthLogout();
    window.location.reload();
  }

  const menuItems = [
    { label: "My Profile", onClick: () => router.push(ROUTES.MY_PROFILE) },
    { label: "Membership", onClick: () => router.push(ROUTES.MEMBERSHIP) },
    { label: "Settings", onClick: () => router.push(ROUTES.SETTINGS) },
    !!loggedInAccount
      ? { label: "Logout", onClick: handleLogout }
      : { label: "Login", onClick: () => openModal('LoginModal') }
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

  const displayName = loggedInAccount?.account_profile?.display_name
    || loggedInAccount?.account_credentials?.email || "";

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
        {!!loggedInAccount ? (
          <div className={styles.profileInfo}>
            <div className={styles.profileName}>{displayName}</div>
            <FaUserCircle className={styles.profileIcon} />
          </div>
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
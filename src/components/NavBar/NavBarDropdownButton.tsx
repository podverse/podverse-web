"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { FaChevronDown, FaRegCircleUser } from "react-icons/fa6";
import { useAccount } from "../../contexts/Account";
import { DropdownMenu } from "../Dropdown/DropdownMenu";
import { useDropdownKeyboardNavigation } from "../../hooks/useDropdownKeyboardNavigation";
import { ROUTES } from "../../constants/routes";
import { useModals } from '../../contexts/Modals'
import { apiRequestService } from "../../factories/apiRequestService";
import styles from "../../styles/components/NavBar/NavBarDropdownButton.module.scss";
import { useTranslations } from "next-intl";

const NavBarDropdownButton: React.FC = () => {
  const { loggedInAccount } = useAccount();
  const { setModalAuthLogin } = useModals();
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const tFeatures = useTranslations("features");
  const tMembership = useTranslations("membership");
  const tSettings = useTranslations("settings");
  const tAuthentication = useTranslations("authentication");

  async function handleLogout() {
    await apiRequestService.reqAuthLogout();
    window.location.reload();
  }

  const menuItems = [
    { label: tFeatures("my_profile"), onClick: () => router.push(ROUTES.MY_PROFILE) },
    { label: tMembership("membership"), onClick: () => router.push(ROUTES.MEMBERSHIP) },
    { label: tSettings("settings"), onClick: () => router.push(ROUTES.SETTINGS) },
    !!loggedInAccount
      ? { label: tAuthentication("logout"), onClick: handleLogout }
      : { label: tAuthentication("login"), onClick: () => setModalAuthLogin({ isOpen: true }) }
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
          <FaRegCircleUser className={styles.profileIcon} />
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
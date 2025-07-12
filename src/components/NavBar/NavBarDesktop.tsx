"use client";

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import { AccountContext } from "../../contexts/Account";
import styles from "../../styles/components/NavBar/NavBarDesktop.module.scss";

function NavBarLeftButtons({ onBack, onForward }: { onBack: () => void; onForward: () => void }) {
  return (
    <div className={styles.leftButtons}>
      <button className={`${styles.navButton} ${styles.navButtonLeft}`} onClick={onBack} aria-label="Back">
        <FaChevronLeft />
      </button>
      <button className={`${styles.navButton} ${styles.navButtonRight}`} onClick={onForward} aria-label="Forward">
        <FaChevronRight />
      </button>
    </div>
  );
}

function NavBarProfileDropdown({ isLoggedIn, onClick }: { isLoggedIn: boolean; onClick: () => void }) {
  return (
    <button className={styles.dropdownButton} onClick={onClick}>
      {isLoggedIn ? <FaRegUserCircle className={styles.profileIcon} /> : <FaUserCircle className={styles.profileIcon} />}
      <FaChevronDown />
    </button>
  );
}

const NavBarDesktop: React.FC = () => {
  const { isLoggedIn } = useContext(AccountContext);
  const router = useRouter();

  const handleDropdownClick = () => {
    console.log("Dropdown button pressed");
  };

  return (
    <nav className={styles.navbar}>
      <NavBarLeftButtons onBack={router.back} onForward={router.forward} />
      <NavBarProfileDropdown isLoggedIn={isLoggedIn} onClick={handleDropdownClick} />
    </nav>
  );
};

export default NavBarDesktop;
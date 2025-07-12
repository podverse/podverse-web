"use client";

import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import { AccountContext } from "../../contexts/Account";
import styles from "../../styles/components/NavBar/NavBarDesktop.module.scss";

const NavBarDesktop: React.FC = () => {
  const { isLoggedIn } = useContext(AccountContext);
  const router = useRouter();

  const handleDropdownClick = () => {
    console.log("Dropdown button pressed");
  };

  const handleBack = () => {
    router.back();
  };

  const handleForward = () => {
    router.forward();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftButtons}>
        <button className={`${styles.navButton} ${styles.navButtonLeft}`} onClick={handleBack} aria-label="Back">
          <FaChevronLeft />
        </button>
        <button className={`${styles.navButton} ${styles.navButtonRight}`} onClick={handleForward} aria-label="Forward">
          <FaChevronRight />
        </button>
      </div>
      <button className={styles.dropdownButton} onClick={handleDropdownClick}>
        {isLoggedIn ? <FaRegUserCircle className={styles.profileIcon} /> : <FaUserCircle className={styles.profileIcon} />}
        <FaChevronDown />
      </button>
    </nav>
  );
};

export default NavBarDesktop;
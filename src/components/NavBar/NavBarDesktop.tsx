"use client";

import React, { useContext } from "react";
import styles from "../../styles/components/NavBar/NavBarDesktop.module.scss";
import { AccountContext } from "../../contexts/Account";
import { useRouter } from "next/navigation";

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
        <button className={styles.navButton} onClick={handleBack} aria-label="Back">
          {"<"}
        </button>
        <button className={styles.navButton} onClick={handleForward} aria-label="Forward">
          {">"}
        </button>
      </div>
      <button className={styles.dropdownButton} onClick={handleDropdownClick}>
        {isLoggedIn ? "Logged in" : "Logged out"}
      </button>
    </nav>
  );
};

export default NavBarDesktop;
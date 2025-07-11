"use client";

import React, { useContext } from "react";
import styles from "../../styles/components/NavBar/NavBarDesktop.module.scss";
import { AccountContext } from "../../contexts/Account";

const NavBarDesktop: React.FC = () => {
  const { isLoggedIn } = useContext(AccountContext);

  const handleDropdownClick = () => {
    console.log("Dropdown button pressed");
  };

  return (
    <nav className={styles.navbar}>
      <button className={styles.dropdownButton} onClick={handleDropdownClick}>
        {isLoggedIn ? "Logged in" : "Logged out"}
      </button>
    </nav>
  );
};

export default NavBarDesktop;
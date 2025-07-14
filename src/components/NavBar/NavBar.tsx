"use client";

import React from "react";
import styles from "../../styles/components/NavBar/NavBar.module.scss";
import NavBarBrand from "./NavBarBrand";
import NavBarLeftButtons from "./NavBarLeftButtons";
import NavBarRightButtons from "./NavBarRightButtons";

const NavBar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <NavBarBrand />
      <NavBarLeftButtons />
      <NavBarRightButtons />
    </nav>
  );
};

export default NavBar;
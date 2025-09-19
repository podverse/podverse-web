"use client";

import classNames from "classnames";
import React from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import styles from "../../styles/components/NavBar/NavBarMoreButton.module.scss";
import { toggleMobileSidebar } from "../../utils/mobileNavMenu";

const NavBarMoreButton: React.FC = () => {
  return (
    <button
      className={styles.button}
      data-mobile-nav="toggle"
      onClick={toggleMobileSidebar}
      aria-label="More"
      type="button"
    >
      <div className={styles.icon} data-mobile-nav="toggle-more">
        <FaBars />
      </div>
      <div className={classNames(styles.icon, "hidden")} data-mobile-nav="toggle-x">
        <FaXmark />
      </div>
    </button>
  );
};

export default NavBarMoreButton;
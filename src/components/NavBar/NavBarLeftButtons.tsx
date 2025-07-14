"use client";

import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "../../styles/components/NavBar/NavBarLeftButtons.module.scss";
import { useRouter } from "next/navigation";

const NavBarLeftButtons: React.FC = () => {
  const router = useRouter();

  return (
    <div className={styles.leftButtons}>
      <button className={`${styles.navButton} ${styles.navButtonLeft}`} onClick={router.back} aria-label="Back">
        <FaChevronLeft />
      </button>
      <button className={`${styles.navButton} ${styles.navButtonRight}`} onClick={router.forward} aria-label="Forward">
        <FaChevronRight />
      </button>
    </div>
  )
}

export default NavBarLeftButtons;

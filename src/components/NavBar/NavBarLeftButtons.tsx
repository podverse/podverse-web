"use client";

import React from "react";
import NavArrowButton from "../NavArrowButton/NavArrowButton";
import styles from "../../styles/components/NavBar/NavBarLeftButtons.module.scss";
import { useRouter } from "next/navigation";

const NavBarLeftButtons: React.FC = () => {
  const router = useRouter();

  return (
    <div className={styles.leftButtons}>
      <NavArrowButton
        direction="left"
        onClick={router.back}
        ariaLabel="Back"
      />
      <NavArrowButton
        direction="right"
        onClick={router.forward}
        ariaLabel="Forward"
      />
    </div>
  )
}

export default NavBarLeftButtons;

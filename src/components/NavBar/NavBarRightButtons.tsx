import React from "react";
import NavBarSearchButton from "./NavBarSearchButton";
import NavBarDropdownButton from "./NavBarDropdownButton";
import NavBarMoreButton from "./NavBarMoreButton";
import styles from "../../styles/components/NavBar/NavBarRightButtons.module.scss";

const NavBarRightButtons: React.FC = () => (
  <div className={styles.rightButtons}>
    <NavBarSearchButton />
    <NavBarDropdownButton />
    <NavBarMoreButton />
  </div>
);

export default NavBarRightButtons;

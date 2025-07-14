"use client";

import Link from "next/link";
import React from "react";
import { FaSearch } from "react-icons/fa";
import styles from "../../styles/components/NavBar/NavBarSearchButton.module.scss";
import { ROUTES } from "../../constants/routes";

const NavBarSearchButton: React.FC = () => (
  <Link href={ROUTES.SEARCH} className={styles.button} aria-label="Search">
    <FaSearch />
  </Link>
);

export default NavBarSearchButton;

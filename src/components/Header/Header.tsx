import React from "react";
import styles from "../../styles/components/Header/Header.module.scss";

type HeaderProps = {
  title: string;
};

export const Header: React.FC<HeaderProps> = ({ title }) => (
  <header className={styles.header}>
    <h1>{title}</h1>
  </header>
);

export default Header;

import React from "react";
import styles from "../../styles/components/Header/Header.module.scss";
import FilterDropdown from "../FilterDropdown/FilterDropdown";

type HeaderProps = {
  title: string;
  filterDropdowns?: React.ReactNode[];
};

export const Header: React.FC<HeaderProps> = ({ title, filterDropdowns }) => (
  <header className={styles.header}>
    <div className={styles.headerContent}>
      <h1 className={styles.title}>{title}</h1>
      {filterDropdowns}
    </div>
  </header>
);

export default Header;

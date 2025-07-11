import React from "react";
import styles from "../../styles/components/SideBar/SideBarBrand.module.scss";

const SideBarBrand: React.FC = () => (
  <a href="/" className={styles.brand}>
    <img
      src="/branding/podverse-brand-white.svg"
      alt="Podverse"
      className={styles.brandImage}
    />
  </a>
);

export default SideBarBrand;
"use client";

import React from "react";
import styles from "../../styles/components/SideBar/SideBarBrand.module.scss";
import { ASSETS } from "../../constants/assets";
import { UITheme } from "../../utils/theme";
import { useTheme } from "../../contexts/Theme";

const SideBarBrand: React.FC<SideBarBrandProps> = () => {
  const { theme } = useTheme();

  const brandSrc = (() => {
    switch (theme) {
      case "dark":
        return ASSETS.IMAGES.BRANDING.BRAND.WHITE;
      case "light":
        return ASSETS.IMAGES.BRANDING.BRAND.BLACK;
      default:
        return ASSETS.IMAGES.BRANDING.BRAND.WHITE;
    }
  })();

  return (
    <a href="/" className={styles.brand}>
      <img src={brandSrc} alt="Podverse" className={styles.brandImage} />
    </a>
  );
};

export default SideBarBrand;
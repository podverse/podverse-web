"use client";

import Link from "next/link";
import React from "react";
import styles from "../../styles/components/SideBar/SideBarBrand.module.scss";
import { ASSETS } from "../../constants/assets";
import { useTheme } from "../../contexts/Theme";
import Image from "next/image";

const SideBarBrand: React.FC = () => {
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
    <Link href="/" className={styles.brand}>
      <Image
        src={brandSrc}
        alt="Podverse"
        className={styles.brandImage}
        width={144}
        height={24.74}
        priority
      />
    </Link>
  );
};

export default SideBarBrand;
"use client";

import Link from "next/link";
import React from "react";
import styles from "../../styles/components/SideBar/SideBarBrand.module.scss";
import { useTheme } from "../../contexts/Theme";
import Image from "next/image";
import { getBrandLogoSrc } from "../../utils/brandLogo";
import { useTranslations } from "next-intl";

const SideBarBrand: React.FC = () => {
  const { theme } = useTheme();
  const tBrand = useTranslations("brand");

  return (
    <Link href="/" className={styles.brand}>
      <Image
        src={getBrandLogoSrc(theme)}
        alt={tBrand("name")}
        width={144}
        height={25}
        priority
      />
    </Link>
  );
};

export default SideBarBrand;
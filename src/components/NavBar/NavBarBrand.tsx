"use client";

import Link from "next/link";
import React from "react";
import styles from "../../styles/components/NavBar/NavBarBrand.module.scss";
import { useLocalSettings } from "../../contexts/LocalSettings";
import { getBrandLogoSrc } from "../../utils/brandLogo";
import { config } from "../../config";
import { Image } from "../Image/Image";

const NavBarBrand: React.FC = () => {
  const { uiTheme } = useLocalSettings();

  return (
    <Link href="/" className={styles.brand}>
      <Image
        src={getBrandLogoSrc(uiTheme)}
        alt={config.public.brand.name}
        width={144}
        height={25}
        skipProxy
      />
    </Link>
  );
};

export default NavBarBrand;
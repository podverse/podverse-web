"use client";

import Link from "next/link";
import React from "react";
import styles from "../../styles/components/NavBar/NavBarBrand.module.scss";
import { useTheme } from "../../contexts/Theme";
import Image from "next/image";
import { getBrandLogoSrc } from "../../utils/brandLogo";
import { config } from "../../config";

const NavBarBrand: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Link href="/" className={styles.brand}>
      <Image
        src={getBrandLogoSrc(theme)}
        alt={config.public.brand.name}
        width={144}
        height={25}
        priority
      />
    </Link>
  );
};

export default NavBarBrand;
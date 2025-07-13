"use client";

import Link from "next/link";
import React from "react";
import styles from "../../styles/components/Footer/FooterCopyright.module.scss";
import { FaRegCopyright } from "react-icons/fa";

const FooterCopyright: React.FC = () => {
  return (
    <Link href="/" className={styles.link}>
      Open Source
      <span className={styles.copyright}>
        <FaRegCopyright />
      </span>
    </Link>
  );
};

export default FooterCopyright;
"use client";

import { useTranslations } from "next-intl";
import styles from '../../styles/components/Content/ContentAboutHeader.module.scss';

export const ContentAboutHeader = () => {
  const tInfo = useTranslations("info");

  return (
    <h2 className={styles.header}>{tInfo("about")}</h2>
  )
}

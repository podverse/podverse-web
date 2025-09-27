"use client";

import { useTranslations } from "next-intl";
import styles from '../../../styles/components/Content/Podroll/ContentPodrollHeader.module.scss';

export const ContentPodrollHeader = () => {
  const tInfo = useTranslations("info");

  return (
    <h3 className={styles.header}>{tInfo("podroll")}</h3>
  )
}

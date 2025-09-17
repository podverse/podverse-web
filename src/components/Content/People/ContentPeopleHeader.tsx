"use client";

import { useTranslations } from "next-intl";
import styles from '../../../styles/components/Content/People/ContentPeopleHeader.module.scss';

export const ContentPeopleHeader = () => {
  const tInfo = useTranslations("info");

  return (
    <h2 className={styles.header}>{tInfo("people.people")}</h2>
  )
}

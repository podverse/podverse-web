"use client";

import React from "react";
import { useTranslations } from "next-intl";
import styles from "../../styles/components/Auth/AuthContactOnlyMessage.module.scss";

type Props = {
  contactEmail: string;
};

export const AuthContactOnlyMessage: React.FC<Props> = ({ contactEmail }) => {
  const t = useTranslations("authentication");

  return (
    <div className={styles.authContactOnlyMessage}>
      <p className={styles.message}>
        {t("contact_only_text_before")}{" "}
        <a href={`mailto:${contactEmail}`} className={styles.emailLink}>
          {contactEmail}
        </a>
      </p>
    </div>
  );
};

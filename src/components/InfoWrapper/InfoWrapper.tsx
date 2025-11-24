"use client";

import React from "react";
import styles from "../../styles/components/InfoWrapper/InfoWrapper.module.scss";

type InfoWrapperProps = {
  children: React.ReactNode;
};

export const InfoWrapper: React.FC<InfoWrapperProps> = ({ children }) => {
  return (
    <div className={styles.infoWrapper}>
      {children}
    </div>
  );
};

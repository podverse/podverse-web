"use client";

import React from "react";
import { InfoWrapper } from "../InfoWrapper/InfoWrapper";
import styles from "../../styles/components/NoResults/NoResults.module.scss";

type NoResultsProps = {
  message?: string;
};

export const NoResults: React.FC<NoResultsProps> = ({ message }) => {
  const displayMessage = message || "No results found";

  return (
    <div className={styles.noResults}>
      <InfoWrapper>
        <p className={styles.noResultsText}>{displayMessage}</p>
      </InfoWrapper>
    </div>
  );
};

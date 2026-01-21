"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "../components/Button/Button";
import styles from "../styles/components/ErrorBoundary/ErrorBoundary.module.scss";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorPageProps) {
  // Note: error.tsx is rendered within the app tree, so it should have access to NextIntl provider
  const tErrors = useTranslations("errors");
  const tMisc = useTranslations("misc");

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className={styles.errorBoundary}>
      <div className={styles.errorBoundaryContent}>
        <h2 className={styles.errorBoundaryTitle}>
          {tErrors("boundary_title")}
        </h2>
        <p className={styles.errorBoundaryMessage}>
          {tErrors("boundary_message")}
        </p>
        {process.env.NODE_ENV === "development" && (
          <details className={styles.errorDetails}>
            <summary className={styles.errorDetailsSummary}>{tErrors("details_development_only")}</summary>
            <pre className={styles.errorDetailsContent}>
              {error.toString()}
              {error.stack && `\n\n${error.stack}`}
              {error.digest && `\n\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
        <div className={styles.errorBoundaryActions}>
          <Button onClick={reset} variant="primary">
            {tMisc("try_again")}
          </Button>
          <Button onClick={handleReload} variant="secondary">
            {tMisc("reload_page")}
          </Button>
          <Button onClick={handleGoHome} variant="outline">
            {tMisc("go_to_home")}
          </Button>
        </div>
      </div>
    </div>
  );
}

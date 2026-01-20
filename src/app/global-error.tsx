"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../components/Button/Button";
import styles from "../styles/components/ErrorBoundary/ErrorBoundary.module.scss";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// Helper to get translations for global-error (rendered outside provider tree)
async function getGlobalErrorTranslations(): Promise<{ errors: Record<string, string>; misc: Record<string, any> }> {
  try {
    // Try to get locale from cookie
    const localeCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] || 'en';
    
    // Load translation file
    const messages = await import(`../../i18n/originals/${localeCookie}.json`);
    return {
      errors: messages.default.errors || {},
      misc: messages.default.misc || {}
    };
  } catch {
    // Fallback to English
    try {
      const messages = await import(`../../i18n/originals/en.json`);
      return {
        errors: messages.default.errors || {},
        misc: messages.default.misc || {}
      };
    } catch {
      // Ultimate fallback
      return {
        errors: {
          global_title: "Application Error",
          global_message: "A critical error occurred. Please refresh the page.",
          details_development_only: "Error details (development only)"
        },
        misc: {
          try_again: "Try again",
          reload_page: "Reload page"
        }
      };
    }
  }
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [translations, setTranslations] = useState<{ errors: Record<string, string>; misc: Record<string, any> }>({
    errors: {
      global_title: "Application Error",
      global_message: "A critical error occurred. Please refresh the page.",
      details_development_only: "Error details (development only)"
    },
    misc: {
      try_again: "Try again",
      reload_page: "Reload page"
    }
  });

  useEffect(() => {
    getGlobalErrorTranslations().then(setTranslations);
  }, []);

  const tErrors = (key: string): string => {
    return translations.errors[key] || key;
  };

  const tMisc = (key: string): string => {
    const value = translations.misc[key];
    // Handle nested objects - if it's a string, return it; otherwise return the key
    return typeof value === 'string' ? value : key;
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <html>
      <body>
        <div className={styles.errorBoundary}>
          <div className={styles.errorBoundaryContent}>
            <h2 className={styles.errorBoundaryTitle}>
              {tErrors("global_title")}
            </h2>
            <p className={styles.errorBoundaryMessage}>
              {tErrors("global_message")}
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
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

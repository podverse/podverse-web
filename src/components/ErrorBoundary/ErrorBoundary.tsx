"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button } from "../Button/Button";
import styles from "../../styles/components/ErrorBoundary/ErrorBoundary.module.scss";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return <ErrorBoundaryFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

type ErrorBoundaryFallbackProps = {
  error: Error;
  resetError: () => void;
};

const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({ error, resetError }) => {
  const tErrors = useTranslations("errors");
  const tMisc = useTranslations("misc");

  const handleReload = () => {
    window.location.reload();
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
            </pre>
          </details>
        )}
        <div className={styles.errorBoundaryActions}>
          <Button onClick={resetError} variant="primary">
            {tMisc("try_again")}
          </Button>
          <Button onClick={handleReload} variant="secondary">
            {tMisc("reload_page")}
          </Button>
        </div>
      </div>
    </div>
  );
};

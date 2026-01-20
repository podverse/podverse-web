"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "../../components/Button/Button";
import { ErrorBoundary } from "../../components/ErrorBoundary/ErrorBoundary";
import styles from "../../styles/app/test-error-boundaries/TestErrorBoundaries.module.scss";

// Component that throws an error when rendered
const ErrorComponent: React.FC<{ message?: string }> = ({ message = "Test error from component" }) => {
  throw new Error(message);
};

// Component that throws an error on mount
const ErrorOnMountComponent: React.FC = () => {
  React.useEffect(() => {
    throw new Error("Error thrown in useEffect");
  }, []);
  return <div>This should not render</div>;
};

// Component that throws an error in render based on state
const ConditionalErrorComponent: React.FC<{ shouldError: boolean }> = ({ shouldError }) => {
  if (shouldError) {
    throw new Error("Conditional render error");
  }
  return <div>No error - component rendered successfully</div>;
};

// Component that throws an error in an event handler (won't be caught by error boundary)
const EventHandlerErrorComponent: React.FC = () => {
  const tTestPage = useTranslations("errors.test_page");
  const handleClick = () => {
    throw new Error("Error in event handler - not caught by error boundary");
  };
  return <Button onClick={handleClick}>{tTestPage("test_error_boundaries_trigger_event_handler_error")}</Button>;
};

// Component that throws an error during render (for route-level error testing)
const RouteErrorComponent: React.FC = () => {
  throw new Error("Route-level error - should show error.tsx");
};

export const TestErrorBoundariesClient: React.FC = () => {
  const tTestPage = useTranslations("errors.test_page");
  const [triggerError, setTriggerError] = useState(false);
  const [triggerMountError, setTriggerMountError] = useState(false);
  const [triggerConditionalError, setTriggerConditionalError] = useState(false);
  const [triggerRouteError, setTriggerRouteError] = useState(false);
  const [errorKey, setErrorKey] = useState(0);

  const handleReset = () => {
    setTriggerError(false);
    setTriggerMountError(false);
    setTriggerConditionalError(false);
    setTriggerRouteError(false);
    setErrorKey(prev => prev + 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{tTestPage("test_error_boundaries_title")}</h1>
        <p className={styles.description}>
          {tTestPage("test_error_boundaries_description")}
        </p>
        <p className={styles.warning}>
          ⚠️ {tTestPage("test_error_boundaries_warning")}
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{tTestPage("test_error_boundaries_section_1_title")}</h2>
        <p className={styles.sectionDescription}>
          {tTestPage("test_error_boundaries_section_1_description")}
        </p>
        <div className={styles.buttonGroup}>
          <Button 
            onClick={() => setTriggerError(true)} 
            variant="danger"
            disabled={triggerError}
          >
            {tTestPage("test_error_boundaries_trigger_render_error")}
          </Button>
          <Button onClick={handleReset} variant="secondary">
            {tTestPage("test_error_boundaries_reset_all")}
          </Button>
        </div>
        {triggerError && (
          <ErrorBoundary key={errorKey}>
            <ErrorComponent message="This is a test render error caught by error boundary" />
          </ErrorBoundary>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{tTestPage("test_error_boundaries_section_2_title")}</h2>
        <p className={styles.sectionDescription}>
          {tTestPage("test_error_boundaries_section_2_description")}
        </p>
        <div className={styles.buttonGroup}>
          <Button 
            onClick={() => setTriggerMountError(true)} 
            variant="danger"
            disabled={triggerMountError}
          >
            {tTestPage("test_error_boundaries_trigger_useeffect_error")}
          </Button>
          <Button onClick={handleReset} variant="secondary">
            {tTestPage("test_error_boundaries_reset_all")}
          </Button>
        </div>
        {triggerMountError && (
          <ErrorBoundary key={errorKey}>
            <ErrorOnMountComponent />
          </ErrorBoundary>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{tTestPage("test_error_boundaries_section_3_title")}</h2>
        <p className={styles.sectionDescription}>
          {tTestPage("test_error_boundaries_section_3_description")}
        </p>
        <div className={styles.buttonGroup}>
          <Button 
            onClick={() => setTriggerConditionalError(true)} 
            variant="danger"
            disabled={triggerConditionalError}
          >
            {tTestPage("test_error_boundaries_trigger_conditional_error")}
          </Button>
          <Button onClick={handleReset} variant="secondary">
            {tTestPage("test_error_boundaries_reset_all")}
          </Button>
        </div>
        {triggerConditionalError && (
          <ErrorBoundary key={errorKey}>
            <ConditionalErrorComponent shouldError={triggerConditionalError} />
          </ErrorBoundary>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{tTestPage("test_error_boundaries_section_4_title")}</h2>
        <p className={styles.sectionDescription}>
          {tTestPage("test_error_boundaries_section_4_description")}
        </p>
        <div className={styles.buttonGroup}>
          <EventHandlerErrorComponent />
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{tTestPage("test_error_boundaries_section_5_title")}</h2>
        <p className={styles.sectionDescription}>
          {tTestPage("test_error_boundaries_section_5_description")}
        </p>
        <div className={styles.buttonGroup}>
          <Button 
            onClick={() => setTriggerRouteError(true)}
            variant="danger"
            disabled={triggerRouteError}
          >
            {tTestPage("test_error_boundaries_trigger_route_error")}
          </Button>
          <Button onClick={handleReset} variant="secondary">
            {tTestPage("test_error_boundaries_reset_all")}
          </Button>
        </div>
        {triggerRouteError && (
          <RouteErrorComponent />
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{tTestPage("test_error_boundaries_section_6_title")}</h2>
        <p className={styles.sectionDescription}>
          {tTestPage("test_error_boundaries_section_6_description")}
        </p>
        <div className={styles.buttonGroup}>
          <Button 
            onClick={() => setTriggerError(true)} 
            variant="danger"
            disabled={triggerError}
          >
            {tTestPage("test_error_boundaries_trigger_nested_error")}
          </Button>
          <Button onClick={handleReset} variant="secondary">
            {tTestPage("test_error_boundaries_reset_all")}
          </Button>
        </div>
        <ErrorBoundary>
          <div className={styles.nestedContainer}>
            <p>{tTestPage("test_error_boundaries_nested_outer_content")}</p>
            {triggerError && (
              <ErrorBoundary key={errorKey}>
                <ErrorComponent message="Inner boundary error" />
              </ErrorBoundary>
            )}
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};

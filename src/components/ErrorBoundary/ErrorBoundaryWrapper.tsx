"use client";

import React, { ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

type ErrorBoundaryWrapperProps = {
  children: ReactNode;
};

export const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

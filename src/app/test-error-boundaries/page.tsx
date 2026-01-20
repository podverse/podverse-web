import React from "react";
import { TestErrorBoundariesClient } from "./TestErrorBoundariesClient";

export default function TestErrorBoundariesPage() {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <TestErrorBoundariesClient />;
}

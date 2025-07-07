import React from "react";
import styles from "./TestComponent.module.css";

const TestComponent: React.FC = () => (
  <div className={styles.test}>
    <p>This is the TestComponent.</p>
  </div>
);

export default TestComponent;

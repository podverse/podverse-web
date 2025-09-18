import React from "react";
import { Button } from "../Button/Button";
import styles from "../../styles/components/Tabs/ButtonTabs.module.scss";

type ButtonTab = {
  key: string;
  label: string;
  onClick: () => void;
};

type ButtonTabsProps = {
  buttonTabs: ButtonTab[];
  selectedKey: string;
  className?: string;
  style?: React.CSSProperties;
};

export const ButtonTabs: React.FC<ButtonTabsProps> = ({ buttonTabs, selectedKey, className = "" }) => (
  <div className={`${styles.buttonTabs} ${className}`}>
    {buttonTabs.map((buttonTab) => (
      <Button
        key={buttonTab.key}
        variant={buttonTab.key === selectedKey ? "miniSelected" : "mini"}
        onClick={buttonTab.onClick}
        className={styles.tabButton}
      >
        {buttonTab.label}
      </Button>
    ))}
  </div>
);

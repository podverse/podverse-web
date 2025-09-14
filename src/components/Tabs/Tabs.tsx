import React from "react";
import { Button } from "../Button/Button";
import styles from "../../styles/components/Tabs/Tabs.module.scss";

type Tab = {
  key: string;
  label: string;
  onClick: () => void;
};

type TabsProps = {
  tabs: Tab[];
  selectedKey: string;
  className?: string;
  style?: React.CSSProperties;
};

const Tabs: React.FC<TabsProps> = ({ tabs, selectedKey, className = "" }) => (
  <div className={`${styles.tabs} ${className}`}>
    {tabs.map((tab) => (
      <Button
        key={tab.key}
        variant={tab.key === selectedKey ? "miniPrimarySelected" : "miniPrimary"}
        onClick={tab.onClick}
        className={styles.tabButton}
      >
        {tab.label}
      </Button>
    ))}
  </div>
);

export default Tabs;
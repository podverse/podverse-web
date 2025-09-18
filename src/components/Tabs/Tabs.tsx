import React from "react";
import { Tab } from "./Tab";
import styles from '../../styles/components/Tabs/Tabs.module.scss';

type TabData = {
  key: string;
  label: string;
  onClick: () => void;
  zIndex: number;
  hideDesktop?: boolean
};

type TabsProps = {
  tabData: TabData[];
  selectedKey: string;
};

export const Tabs: React.FC<TabsProps> = ({ tabData, selectedKey }) => {
  const tabNodes = tabData.map((tab) => {
    return (
      <Tab
        key={tab.key}
        label={tab.label}
        onClick={tab.onClick}
        selected={tab.key === selectedKey}
        hideDesktop={tab.hideDesktop}
        zIndex={tab.zIndex}
      />
    )
  })

  return (
    <div className={styles.tabs}>
      {tabNodes}
    </div>
  )
}

import React from "react";
import styles from "../../styles/components/SideBar/SideBarHeader.module.scss";

interface Props {
  children: React.ReactNode;
}

const SideBarHeader: React.FC<Props> = ({ children }) => (
  <div className={styles.header}>
    {children}
  </div>
);

export default SideBarHeader;
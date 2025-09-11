import React from "react";
import styles from "../../styles/components/SideBar/SideBarDivider.module.scss";

type SideBarDividerProps = {
  noMarginTop?: boolean;
};

const SideBarDivider: React.FC<SideBarDividerProps> = ({ noMarginTop }) => (
  <hr
    className={styles.divider}
    style={noMarginTop ? { marginTop: 0 } : undefined}
  />
);

export default SideBarDivider;
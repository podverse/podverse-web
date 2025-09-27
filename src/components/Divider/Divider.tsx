
import React from "react";
import styles from "../../styles/components/Divider/Divider.module.scss";
import classNames from "classnames";

type DividerProps = {
  className?: string;
};

export const Divider: React.FC<DividerProps> = ({ className }) => (
  <hr className={classNames(styles.divider, className)} />
);

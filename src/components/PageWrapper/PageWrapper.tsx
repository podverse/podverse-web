import React from "react";
import styles from "../../styles/components/PageWrapper/PageWrapper.module.scss";

type PageWrapperProps = {
  children: React.ReactNode;
};

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => (
  <div id="page-wrapper" className={styles.pageWrapper}>
    {children}
  </div>
);

export default PageWrapper;
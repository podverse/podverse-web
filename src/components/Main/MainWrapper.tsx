import React from "react";
import { Divider } from "../Divider/Divider";
import Footer from "../Footer/Footer";
import styles from "../../styles/components/Main/MainWrapper.module.scss";

type MainWrapperProps = {
  children: React.ReactNode;
  emptyStateComponent?: React.ReactNode;
};

export const MainWrapper: React.FC<MainWrapperProps> = ({ children, emptyStateComponent }) => (
  <div id="mainOuterWrapper" className={styles.mainOuterWrapper}>
    <main className={styles.main}>
      {React.Children.count(children) > 0 ? (
        children
      ) : emptyStateComponent ? (
        <div className={styles.emptyStateWrapper}>
          {emptyStateComponent}
        </div>
      ) : null}
    </main>
    <Divider />
    <Footer />
  </div>
);

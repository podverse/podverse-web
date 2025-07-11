import React from "react";
import styles from "../../styles/components/Main/MainWrapper.module.scss";
// import NavBarDesktop from "../NavBar/NavBarDesktop";

type MainWrapperProps = {
  children: React.ReactNode;
};

const MainWrapper: React.FC<MainWrapperProps> = ({ children }) => (
  <div className={styles.wrapper}>
    {/* <NavBarDesktop /> */}
    <main className={styles.main}>
      {children}
    </main>
  </div>
);

export default MainWrapper;
import React from "react";
import styles from "../../styles/components/SideBar/SideBarLink.module.scss";

type SideBarLinkProps = {
  href: string;
  children: React.ReactNode;
};

const SideBarLink: React.FC<SideBarLinkProps> = ({ href, children }) => (
  <a href={href} className={styles.link}>
    {children}
  </a>
);

export default SideBarLink;
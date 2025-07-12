import Link from "next/link";
import React from "react";
import styles from "../../styles/components/SideBar/SideBarLink.module.scss";

type Props = {
  href: string;
  children: React.ReactNode;
};

const SideBarLink: React.FC<Props> = ({ href, children }) => (
  <Link href={href} className={styles.link}>
    {children}
  </Link>
);

export default SideBarLink;
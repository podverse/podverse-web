import { Link } from "../Link/Link";
import React from "react";
import styles from "../../styles/components/SideBar/SideBarLink.module.scss";

type Props = {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
};

const SideBarLink: React.FC<Props> = ({ href, children, disabled }) => (
  <Link
    href={href}
    className={styles.link}
    disabled={disabled}
    color="secondary">
    {children}
  </Link>
);

export default SideBarLink;
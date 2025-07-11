import React from "react";
import styles from "../../styles/components/SideBar/SideBar.module.scss";
import { ROUTES } from "../../constants/routes";
import SideBarBrand from "./SideBarBrand";
import SideBarLink from "./SideBarLink";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import SideBarDivider from "./SideBarDivider";
import { UITheme } from "../../utils/theme";

type SideBarProps = {
  theme: UITheme;
};

const SideBar: React.FC<SideBarProps> = ({ theme }) => (
  <nav className={styles.sidebar}>
    <SideBarBrand theme={theme} />
    <SideBarLink href={ROUTES.SEARCH}>Search</SideBarLink>
    <SideBarDivider />
    <SideBarLink href={ROUTES.PODCASTS}>Podcasts</SideBarLink>
    <SideBarLink href={ROUTES.EPISODES}>Episodes</SideBarLink>
    <SideBarLink href={ROUTES.PLAYLISTS}>Playlists</SideBarLink>
    <SideBarLink href={ROUTES.SETTINGS}>Settings</SideBarLink>
    <SideBarLink href={ROUTES.ABOUT}>About</SideBarLink>
    <ThemeToggle theme={theme} />
  </nav>
);

export default SideBar;

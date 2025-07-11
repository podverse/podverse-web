import React from "react";
import styles from "../../styles/components/SideBar/SideBar.module.scss";
import { ROUTES } from "../../constants/routes";
import SideBarBrand from "./SideBarBrand";
import SideBarLink from "./SideBarLink";

const SideBar: React.FC = () => (
  <nav className={styles.sidebar}>
    <SideBarBrand />
    <SideBarLink href={ROUTES.HOME}>Home</SideBarLink>
    <SideBarLink href={ROUTES.PODCASTS}>Podcasts</SideBarLink>
    <SideBarLink href={ROUTES.EPISODES}>Episodes</SideBarLink>
    <SideBarLink href={ROUTES.PLAYLISTS}>Playlists</SideBarLink>
    <SideBarLink href={ROUTES.SETTINGS}>Settings</SideBarLink>
    <SideBarLink href={ROUTES.ABOUT}>About</SideBarLink>
  </nav>
);

export default SideBar;

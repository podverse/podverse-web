import React from "react";
import { FaSearch } from "react-icons/fa";
import { ROUTES } from "../../constants/routes";
import styles from "../../styles/components/SideBar/SideBar.module.scss";
import SideBarBrand from "./SideBarBrand";
import SideBarLink from "./SideBarLink";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import SideBarDivider from "./SideBarDivider";
import SideBarHeader from "./SideBarHeader";


const SideBar: React.FC = () => (
  <nav className={styles.sidebar}>
    <SideBarBrand />
    <SideBarLink href={ROUTES.SEARCH}><FaSearch style={{ marginRight: "0.5rem" }} />Search</SideBarLink>
    <SideBarDivider />
    <SideBarLink href={ROUTES.PODCASTS}>Podcasts</SideBarLink>
    <SideBarLink href={ROUTES.EPISODES}>Episodes</SideBarLink>
    <SideBarLink href={ROUTES.CLIPS}>Clips</SideBarLink>
    <SideBarLink href={ROUTES.MUSIC}>Music</SideBarLink>
    <SideBarLink href={ROUTES.TRACKS}>Tracks</SideBarLink>
    <SideBarDivider />
    <SideBarHeader>My Library</SideBarHeader>
    <SideBarLink href={ROUTES.QUEUE}>Queue</SideBarLink>
    <SideBarLink href={ROUTES.HISTORY}>History</SideBarLink>
    <SideBarLink href={ROUTES.PLAYLISTS}>Playlists</SideBarLink>
    <SideBarLink href={ROUTES.MY_CLIPS}>My Clips</SideBarLink>
    <SideBarLink href={ROUTES.PROFILES}>Profiles</SideBarLink>
    <SideBarDivider />
    <ThemeToggle />
  </nav>
);

export default SideBar;

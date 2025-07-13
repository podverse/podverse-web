import React from "react";
import { FaSearch } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { ROUTES } from "../../constants/routes";
import styles from "../../styles/components/SideBar/SideBar.module.scss";
import SideBarDivider from "./SideBarDivider";
import SideBarBrand from "./SideBarBrand";
import SideBarLink from "./SideBarLink";
import SideBarHeader from "./SideBarHeader";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const SideBar: React.FC = () => {
  const tMedia = useTranslations("media");
  const tFeatures = useTranslations("features");

  return (
    <nav className={styles.sidebar}>
      <div className={styles.stickyTop}>
        <SideBarBrand />
        <SideBarLink href={ROUTES.SEARCH}>
          <FaSearch style={{ marginRight: "0.5rem" }} />
          {tFeatures("search")}
        </SideBarLink>
        <SideBarDivider />
      </div>
      <div className={styles.scrollable}>
        <SideBarLink href={ROUTES.PODCASTS}>{tMedia("podcast.podcasts")}</SideBarLink>
        <SideBarLink href={ROUTES.EPISODES}>{tMedia("podcast.episodes")}</SideBarLink>
        <SideBarLink href={ROUTES.CLIPS}>{tMedia("clips")}</SideBarLink>
        <SideBarLink href={ROUTES.LIVESTREAMS}>{tMedia("livestreams")}</SideBarLink>
        <SideBarDivider />
        <SideBarHeader>{tMedia("music.music")}</SideBarHeader>
        <SideBarLink href={ROUTES.MUSIC}>{tMedia("music.artists")}</SideBarLink>
        <SideBarLink href={ROUTES.ALBUMS}>{tMedia("music.albums")}</SideBarLink>
        <SideBarLink href={ROUTES.TRACKS}>{tMedia("music.tracks")}</SideBarLink>
        <SideBarDivider />
        <SideBarHeader>{tMedia("video.video")}</SideBarHeader>
        <SideBarLink href={ROUTES.CHANNELS}>{tMedia("video.channels")}</SideBarLink>
        <SideBarLink href={ROUTES.VIDEOS}>{tMedia("video.videos")}</SideBarLink>
        <SideBarDivider />
        <SideBarHeader>{tFeatures("my_library")}</SideBarHeader>
        <SideBarLink href={ROUTES.QUEUE}>{tFeatures("queue")}</SideBarLink>
        <SideBarLink href={ROUTES.HISTORY}>{tFeatures("history")}</SideBarLink>
        <SideBarLink href={ROUTES.PLAYLISTS}>{tFeatures("playlists")}</SideBarLink>
        <SideBarLink href={ROUTES.MY_CLIPS}>{tFeatures("my_clips")}</SideBarLink>
        <SideBarLink href={ROUTES.PROFILES}>{tFeatures("profiles")}</SideBarLink>
        <SideBarDivider />
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default SideBar;

import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { ROUTES } from "../../constants/routes";
import SideBarDivider from "./SideBarDivider";
import SideBarBrand from "./SideBarBrand";
import SideBarLink from "./SideBarLink";
import SideBarHeader from "./SideBarHeader";
// import { UIThemeToggle } from "../UIThemeToggle/UIThemeToggle";
import Accordion from "../Accordian/Accordian";
import styles from "../../styles/components/SideBar/SideBar.module.scss";

export const SideBar: React.FC = () => {
  const tMedia = useTranslations("media");
  const tFeatures = useTranslations("features");

  return (
    <nav id="sidebar" className={styles.sidebar} data-mobile-nav="menu">
      <div className={styles.stickyTop} data-mobile-nav="branding">
        <SideBarBrand />
        <SideBarLink href={ROUTES.SEARCH}>
          <FaMagnifyingGlass className={styles.icon} />
          {tFeatures("search.search")}
        </SideBarLink>
      </div>
      <div className={styles.scrollable} tabIndex={-1}>
        <SideBarDivider noMarginTop />
        <Accordion
          header={<SideBarHeader>{tMedia("podcast.podcasts")}</SideBarHeader>}
          headerClass={styles.accordianHeader}
          content={
            <>
              <SideBarLink href={ROUTES.PODCASTS}>{tMedia("podcast.podcasts")}</SideBarLink>
              <SideBarLink href={ROUTES.EPISODES}>{tMedia("podcast.episodes")}</SideBarLink>
              <SideBarLink href={ROUTES.CLIPS}>{tFeatures("clip.clips")}</SideBarLink>
              <SideBarLink href={ROUTES.LIVESTREAMS}>{tMedia("livestream.livestreams")}</SideBarLink>
            </>
          }
          color="link"
          size="small"
          open
        />
        <SideBarDivider />
        <Accordion
          header={<SideBarHeader>{tMedia("music.music")}</SideBarHeader>}
          headerClass={styles.accordianHeader}
          content={
            <>
              <SideBarLink disabled href={ROUTES.ARTISTS}>{tMedia("music.artists")}</SideBarLink>
              <SideBarLink disabled href={ROUTES.ALBUMS}>{tMedia("music.albums")}</SideBarLink>
              <SideBarLink disabled href={ROUTES.TRACKS}>{tMedia("music.tracks")}</SideBarLink>
              <SideBarLink disabled href={ROUTES.LIVESTREAMS}>{tMedia("livestream.livestreams")}</SideBarLink>
            </>
          }
          color="link"
          size="small"
          open
        />
        <SideBarDivider />
        <Accordion
          header={<SideBarHeader>{tFeatures("my_library")}</SideBarHeader>}
          headerClass={styles.accordianHeader}
          content={
            <>
              <SideBarLink href={ROUTES.QUEUES}>{tFeatures("queue.queues")}</SideBarLink>
              <SideBarLink href={ROUTES.HISTORY}>{tFeatures("history.history")}</SideBarLink>
              <SideBarLink href={ROUTES.PLAYLISTS}>{tFeatures("playlist.playlists")}</SideBarLink>
              <SideBarLink disabled href={ROUTES.MY_CLIPS}>{tFeatures("my_clips")}</SideBarLink>
              <SideBarLink disabled href={ROUTES.PROFILES}>{tFeatures("profiles")}</SideBarLink>
            </>
          }
          color="link"
          size="small"
          open
        />
        {/* <SideBarDivider /> */}
        {/* <UIThemeToggle /> */}
      </div>
    </nav>
  );
};

import linkifyHtml from "linkify-html";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { Episode, MediaRef, Podcast } from "podverse-shared";
import { useEffect, useRef, useState } from "react";
import {
  ClipListItem,
  ColumnsWrapper,
  EpisodeListItem,
  List,
  Meta,
  PageHeader,
  PageScrollableContent,
  Pagination,
  PodcastPageHeader,
  SideContent,
} from "~/components";
import { scrollToTopOfPageScrollableContent } from "~/components/PageScrollableContent/PageScrollableContent";
import { calcListPageCount } from "~/lib/utility/misc";
import { PV } from "~/resources";
import { getPodcastById } from "~/services/podcast";
import { getEpisodesByQuery } from "~/services/episode";
import { getMediaRefsByQuery } from "~/services/mediaRef";
import { getServerSideAuthenticatedUserInfo } from "~/services/auth";
import { Page } from "~/lib/utility/page";
import { sanitizeTextHtml } from "~/lib/utility/sanitize";
import { getServerSideUserQueueItems } from "~/services/userQueueItem";
import { FundingLink } from "~/components/FundingLink/FundingLink";

interface ServerProps extends Page {
  serverClips: MediaRef[];
  serverClipsPageCount: number;
  serverEpisodes: Episode[];
  serverEpisodesPageCount: number;
  serverFilterPage: number;
  serverFilterSort: string;
  serverFilterType: string;
  serverPodcast: Podcast;
}

type FilterState = {
  filterPage?: number;
  filterSort?: string;
  filterType?: string;
};

const keyPrefix = "pages_podcast";

/* *TODO* 
    Rewrite this file to follow the patterns in pages/podcasts and pages/search.
    Move all functions inside the render function,
    get rid of the filterState,
    stop passing in filterState as a parameter,
    and instead get and set the filterState fields individually.
    Keep the sections in the same order
    (Initialization, useEffects, Client-Side Queries, Render Helpers).
*/

export default function Podcast({
  serverClips,
  serverClipsPageCount,
  serverFilterPage,
  serverFilterSort,
  serverFilterType,
  serverEpisodes,
  serverEpisodesPageCount,
  serverPodcast,
}: ServerProps) {
  /* Initialize */

  const { id } = serverPodcast;
  const { t } = useTranslation();
  const [filterState, setFilterState] = useState({
    filterPage: serverFilterPage,
    filterSort: serverFilterSort,
    filterType: serverFilterType,
  } as FilterState);
  const { filterPage, filterSort, filterType } = filterState;
  const [episodesListData, setEpisodesListData] =
    useState<Episode[]>(serverEpisodes);
  const [episodesPageCount, setEpisodesPageCount] = useState<number>(
    serverEpisodesPageCount
  );
  const [clipsListData, setClipsListData] = useState<MediaRef[]>(serverClips);
  const [clipsPageCount, setClipsPageCount] =
    useState<number>(serverClipsPageCount);
  const initialRender = useRef(true);
  const pageCount =
    filterType === PV.Filters.type._episodes
      ? episodesPageCount
      : clipsPageCount;

  /* useEffects */

  useEffect(() => {
    (async () => {
      if (initialRender.current) {
        initialRender.current = false;
      } else {
        if (filterType === PV.Filters.type._episodes) {
          const { data } = await clientQueryEpisodes(
            { page: filterPage, podcastIds: id, sort: filterSort },
            filterState
          );
          const [newEpisodesListData, newEpisodesListCount] = data;
          setEpisodesListData(newEpisodesListData);
          setEpisodesPageCount(calcListPageCount(newEpisodesListCount));
        } else if (filterType === PV.Filters.type._clips) {
          const { data } = await clientQueryClips(
            { page: filterPage, podcastIds: id, sort: filterSort },
            filterState
          );
          const [newClipsListData, newClipsListCount] = data;
          setClipsListData(newClipsListData);
          setClipsPageCount(calcListPageCount(newClipsListCount));
        }
        scrollToTopOfPageScrollableContent();
      }
    })();
  }, [filterPage, filterSort, filterType]);

  /* Meta Tags */

  const podcastTitle = serverPodcast.title || t("untitledPodcast");
  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.podcast}/${serverPodcast.id}`,
    description: serverPodcast.description,
    imageAlt: podcastTitle,
    imageUrl: serverPodcast.shrunkImageUrl,
    title: podcastTitle,
  };

  const fundingLinks = serverPodcast.funding.map((link) => {
    return <FundingLink link={link.url} value={link.value}></FundingLink>;
  });

  return (
    <>
      <Meta
        description={meta.description}
        ogDescription={meta.description}
        ogImage={meta.imageUrl}
        ogTitle={meta.title}
        ogType="website"
        ogUrl={meta.currentUrl}
        robotsNoIndex={false}
        title={meta.title}
        twitterDescription={meta.description}
        twitterImage={meta.imageUrl}
        twitterImageAlt={meta.imageAlt}
        twitterTitle={meta.title}
      />
      <PodcastPageHeader podcast={serverPodcast} />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <>
              <PageHeader
                isSubHeader
                primaryOnChange={(selectedItems: any[]) => {
                  const selectedItem = selectedItems[0];
                  setFilterState({
                    filterPage: 1,
                    filterSort,
                    filterType: selectedItem.key,
                  });
                }}
                primaryOptions={PV.Filters.dropdownOptions.podcast.from}
                primarySelected={filterType}
                sortOnChange={(selectedItems: any[]) => {
                  const selectedItem = selectedItems[0];
                  setFilterState({
                    filterPage: 1,
                    filterSort: selectedItem.key,
                    filterType,
                  });
                }}
                sortOptions={PV.Filters.dropdownOptions.podcast.sort}
                sortSelected={filterSort}
                text={
                  filterType === PV.Filters.type._episodes
                    ? t("Episodes")
                    : t("Clips")
                }
              />
              <List>
                {filterType === PV.Filters.type._episodes &&
                  generateEpisodeListElements(episodesListData, serverPodcast)}
                {filterType === PV.Filters.type._clips &&
                  generateClipListElements(clipsListData, serverPodcast)}
              </List>
              <Pagination
                currentPageIndex={filterPage}
                handlePageNavigate={(newPage) => {
                  setFilterState({
                    filterPage: newPage,
                    filterSort,
                    filterType,
                  });
                }}
                handlePageNext={() => {
                  const newPage = filterPage + 1;
                  if (newPage <= pageCount) {
                    setFilterState({
                      filterPage: newPage,
                      filterSort,
                      filterType,
                    });
                  }
                }}
                handlePagePrevious={() => {
                  const newPage = filterPage - 1;
                  if (newPage > 0) {
                    setFilterState({
                      filterPage: newPage,
                      filterSort,
                      filterType,
                    });
                  }
                }}
                pageCount={pageCount}
              />
            </>
          }
          sideColumnChildren={
            <SideContent>
              <h2>{t("About")}</h2>
              <div
                className="text"
                dangerouslySetInnerHTML={{
                  __html: sanitizeTextHtml(
                    linkifyHtml(serverPodcast.description)
                  ),
                }}
              />
              {fundingLinks && fundingLinks}
            </SideContent>
          }
        />
      </PageScrollableContent>
    </>
  );
}

/* Client-Side Queries */

type ClientQueryEpisodes = {
  page?: number;
  podcastIds?: string;
  sort?: string;
};

const clientQueryEpisodes = async (
  { page, podcastIds, sort }: ClientQueryEpisodes,
  filterState: FilterState
) => {
  const finalQuery = {
    podcastIds,
    ...(page ? { page } : { page: filterState.filterPage }),
    ...(sort ? { sort } : { sort: filterState.filterSort }),
  };
  return getEpisodesByQuery(finalQuery);
};

type ClientQueryClips = {
  page?: number;
  podcastIds?: string;
  sort?: string;
};

const clientQueryClips = async (
  { page, podcastIds, sort }: ClientQueryClips,
  filterState: FilterState
) => {
  const finalQuery = {
    podcastIds,
    includeEpisode: true,
    ...(page ? { page } : { page: filterState.filterPage }),
    ...(sort ? { sort } : { sort: filterState.filterSort }),
  };
  return getMediaRefsByQuery(finalQuery);
};

/* Render Helpers */

const generateEpisodeListElements = (
  listItems: Episode[],
  podcast: Podcast
) => {
  return listItems.map((listItem, index) => (
    <EpisodeListItem
      episode={listItem}
      key={`${keyPrefix}-${index}`}
      podcast={podcast}
    />
  ));
};

const generateClipListElements = (listItems: MediaRef[], podcast: Podcast) => {
  return listItems.map((listItem, index) => (
    <ClipListItem
      mediaRef={listItem}
      podcast={podcast}
      key={`${keyPrefix}-${index}`}
    />
  ));
};

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, params, req } = ctx;
  const { cookies } = req;
  const { podcastId } = params;

  const userInfo = await getServerSideAuthenticatedUserInfo(cookies);
  const userQueueItems = await getServerSideUserQueueItems(cookies);

  const serverFilterType = PV.Filters.type._episodes;
  const serverFilterSort = PV.Filters.sort._mostRecent;
  const serverFilterPage = 1;

  const response = await getPodcastById(podcastId as string);
  const podcast = response.data;

  let serverEpisodes = [];
  let serverEpisodesPageCount = 0;
  let serverClips = [];
  let serverClipsPageCount = 0;
  if (serverFilterType === PV.Filters.type._episodes) {
    const response = await getEpisodesByQuery({
      podcastIds: podcastId,
      sort: serverFilterSort,
    });
    const [episodesListData, episodesListDataCount] = response.data;
    serverEpisodes = episodesListData;
    serverEpisodesPageCount = calcListPageCount(episodesListDataCount);
  } else {
    // handle mediaRefs query
  }

  const serverProps: ServerProps = {
    serverUserInfo: userInfo,
    serverUserQueueItems: userQueueItems,
    ...(await serverSideTranslations(locale, PV.i18n.fileNames.all)),
    serverCookies: cookies,
    serverClips,
    serverClipsPageCount,
    serverEpisodes,
    serverEpisodesPageCount,
    serverFilterPage,
    serverFilterSort,
    serverFilterType,
    serverPodcast: podcast,
  };

  return {
    props: serverProps,
  };
};
function item(item: any) {
  throw new Error("Function not implemented.");
}

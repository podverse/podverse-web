"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { apiRequestService } from "../../../factories/apiRequestService";
import { redirectToChannelPageByMediumClient } from "../../../utils/redirect/redirectToChannelPageByMedium";
import { formatDateAbbrev, SearchPodcastsFeed } from "podverse-helpers";
import React from "react";
import { Image } from "../../Image/Image";
import { ROUTES } from "../../../constants/routes";
import { IMAGES } from "../../../constants/images";
import styles from "../../../styles/components/List/SearchResults/ListSearchResultPodcastIndexFeedRow.module.scss";
import { Link } from "../../Link/Link";

interface Props {
  searchResultPodcastIndexFeed: SearchPodcastsFeed;
}

const ListSearchResultPodcastIndexFeedRow: React.FC<Props> = ({ searchResultPodcastIndexFeed }) => {
  const router = useRouter();
  const imageUrl = searchResultPodcastIndexFeed.image || searchResultPodcastIndexFeed.artwork;
  const description = searchResultPodcastIndexFeed.description || ""; 
  const lastPubDate = searchResultPodcastIndexFeed.newestItemPubdate || null;
  const author = searchResultPodcastIndexFeed.author || null;
  const tMedia = useTranslations("media");
  const locale = useLocale();
  
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const ssrChannel = await apiRequestService.reqChannelGetByPodcastIndexId(searchResultPodcastIndexFeed.id);
    if (ssrChannel?.medium_id) {
      redirectToChannelPageByMediumClient(router)(ssrChannel.medium_id, ssrChannel.id_text);
    } else {
      const url = `${ROUTES.PODCAST_INDEX}/feed/${searchResultPodcastIndexFeed.id}`;
      router.push(url);
    }
  };

  return (
    <Link className={styles.link} onClick={handleClick}>
      <div className={styles.listItem}>
        <Image
          src={imageUrl}
          alt={searchResultPodcastIndexFeed.title || tMedia("podcast.podcast_image")}
          width={IMAGES.LIST.PODCASTS.SIZE}
          height={IMAGES.LIST.PODCASTS.SIZE}
          className={styles.image}
        />
        <div className={styles.content}>
          <h3 className={styles.title}>{searchResultPodcastIndexFeed.title}</h3>
          {
            author && (
              <div className={styles.author}>
                {author}
              </div>
            )
          }
          {
            lastPubDate && (
              <span className={styles.lastPubDate}>
                {tMedia("updated_with_date", {
                  date: formatDateAbbrev(lastPubDate, locale)
                })}
              </span>
            )
          }
          {
            description && (
              <div className={styles.description}>
                {description}
              </div>
            )
          }
        </div>
      </div>
    </Link>
  );
};

export default ListSearchResultPodcastIndexFeedRow;

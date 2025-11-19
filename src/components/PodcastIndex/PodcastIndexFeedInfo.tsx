"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatDateAbbrev, PodcastByIdFeed } from "podverse-helpers";
import { Image } from "../Image/Image";
import { IMAGES } from "../../constants/images";
import { Button } from "../Button/Button";
import styles from "../../styles/components/PodcastIndex/PodcastIndexFeedInfo.module.scss";
import { useState, useRef, useEffect } from "react";
import { apiRequestService } from "../../factories/apiRequestService";
import { handleRateLimitAlert } from "../../utils/rateLimit/rateLimitAlert";
import { useRouter } from "next/navigation";
import { redirectToChannelPageByMediumClient } from "../../utils/redirect/redirectToChannelPageByMedium";
import { useAccount } from "../../contexts/Account";
import { useModals } from "../../contexts/Modals";

type PodcastIndexFeedInfoProps = {
  podcastIndexFeed: PodcastByIdFeed;
};

export const PodcastIndexFeedInfo: React.FC<PodcastIndexFeedInfoProps> = ({ podcastIndexFeed }) => {
  const tFeatures = useTranslations("features");
  const tMedia = useTranslations("media");
  const tMisc = useTranslations("misc");
  const tInstructions = useTranslations("instructions");
  const [isLoading, setIsLoading] = useState(false);
  const imageUrl = podcastIndexFeed.image || podcastIndexFeed.artwork || null;
  const description = podcastIndexFeed.description || ""; 
  const lastUpdateTime = podcastIndexFeed.lastUpdateTime || null;
  const author = podcastIndexFeed.author || null;
  const locale = useLocale();
  const router = useRouter();
  const redirectToChannel = redirectToChannelPageByMediumClient(router);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasRedirectedRef = useRef(false);
  const { loggedInAccount } = useAccount();
  const { setModalLoginRequired } = useModals();

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const startPollingForChannel = (podcastIndexId: string | number) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    const idText = String(podcastIndexId);
    pollIntervalRef.current = setInterval(async () => {
      if (hasRedirectedRef.current) return;
      try {
        const ssrChannel = await apiRequestService.reqChannelGetByPodcastIndexId(idText);
        if (ssrChannel?.medium_id && ssrChannel?.id_text) {
          hasRedirectedRef.current = true;
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          redirectToChannel(ssrChannel.medium_id, ssrChannel.id_text);
        }
      } catch (e) {
        console.log("Checking for channel...not found yet.");
      }
    }, 2000);
  };

  const addFeedOnClick = async () => {
    if (!loggedInAccount) {
      setModalLoginRequired({
        title: null,
        message: tInstructions("login_to_add_feeds")
      })
      return;
    }
    
    setIsLoading(true);

    if (podcastIndexFeed?.url && podcastIndexFeed?.id) {
      try {
        await apiRequestService.reqMQRSSAddOnDemand({
          url: podcastIndexFeed.url,
          podcast_index_id: podcastIndexFeed.id
        });
        
        startPollingForChannel(podcastIndexFeed.id);
      } catch (error) {
        const handled = handleRateLimitAlert(error, locale, tMisc);
        if (!handled) {
          console.error(error);
          alert("Error performing action.");
        }
        setIsLoading(false);
      }
      return;
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.explanation}>
          {tFeatures("add_feed.add_feed_explanation")}
        </div>
        <Button
          variant="primary"
          onClick={addFeedOnClick}
          className={styles.addFeedButton}
          isLoading={isLoading}
        >
          {tFeatures("add_feed.add_feed")}
        </Button>
      </div>
      {
        imageUrl && (
          <Image
            src={imageUrl}
            alt={podcastIndexFeed.title || tMedia("podcast.podcast_image")}
            width={IMAGES.ADD_FEED.SQUARE.SIZE}
            height={IMAGES.ADD_FEED.SQUARE.SIZE}
            className={styles.image}
          />
        )
      }
      <h2 className={styles.title}>{podcastIndexFeed.title}</h2>
      <div className={styles.content}>
        {
          author && (
            <div className={styles.author}>
              {podcastIndexFeed.author}
            </div>
          )
        }
        {
          lastUpdateTime && (
            <span className={styles.lastUpdateTime}>
              {tMedia("updated_with_date", {
                date: formatDateAbbrev(lastUpdateTime, locale)
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
  )
};

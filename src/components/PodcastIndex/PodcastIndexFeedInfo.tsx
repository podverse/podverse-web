import { useLocale, useTranslations } from "next-intl";
import { formatDateAbbrev, PodcastByIdFeed } from "podverse-helpers";
import { Image } from "../Image/Image";
import { IMAGES } from "../../constants/images";
import { Button } from "../Button/Button";
import styles from "../../styles/components/PodcastIndex/PodcastIndexFeedInfo.module.scss";

type PodcastIndexFeedInfoProps = {
  podcastIndexFeed: PodcastByIdFeed;
};

export const PodcastIndexFeedInfo: React.FC<PodcastIndexFeedInfoProps> = ({ podcastIndexFeed }) => {
  const tFeatures = useTranslations("features");
  const tMedia = useTranslations("media");
  const imageUrl = podcastIndexFeed.image || podcastIndexFeed.artwork || null;
  const description = podcastIndexFeed.description || ""; 
  const lastUpdateTime = podcastIndexFeed.lastUpdateTime || null;
  const author = podcastIndexFeed.author || null;
  const locale = useLocale();

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.explanation}>
          {tFeatures("add_feed.add_feed_explanation")}
        </div>
        <Button
          variant="primary"
          onClick={() => alert("Add feed functionality coming soon!")}
          className={styles.addFeedButton}
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

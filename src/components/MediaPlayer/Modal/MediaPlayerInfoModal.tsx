"use client";

import { useTranslations } from "next-intl";
import { findDTOChannelImageBySize, findDTOItemImageBySize, MediumEnum } from "podverse-helpers";
import { useMediaPlayer } from "../../../contexts/MediaPlayer";
import styles from "../../../styles/components/MediaPlayer/Modal/MediaPlayerInfoModal.module.scss";
import { ReadableTimeRange } from "../../Time/ReadableTimeRange";
import { useRouter } from "next/navigation";
import Link from "../../Link/Link";

function useLinkHelper({
  mpChannel,
  mpItem,
  mpClip,
  mpItemChapter,
  mpItemSoundbite,
}: any) {
  let channelLinkUrl = "";
  let itemLinkUrl = "";
  let subsectionUrl = "";

  if (mpChannel?.medium_id) {
    if (mpChannel.medium_id === MediumEnum.Podcast) {
      channelLinkUrl = `/podcast/${mpChannel.id_text}`;
      if (mpItem) {
        itemLinkUrl = `/episode/${mpItem.id_text}`;
      }
    } else if (mpChannel.medium_id === MediumEnum.Video) {
      channelLinkUrl = `/channel/${mpChannel.id_text}`;
      if (mpItem) {
        itemLinkUrl = `/video/${mpItem.id_text}`;
      }
    } else if (mpChannel.medium_id === MediumEnum.Music) {
      channelLinkUrl = `/album/${mpChannel.id_text}`;
      if (mpItem) {
        itemLinkUrl = `/track/${mpItem.id_text}`;
      }
    }
  }

  if (mpClip) {
    subsectionUrl = `/clip/${mpClip.id_text}`;
  } else if (mpItemSoundbite) {
    subsectionUrl = `/official-clip/${mpItemSoundbite.id_text}`;
  } else if (mpItemChapter) {
    subsectionUrl = `/chapter/${mpItemChapter.id_text}`;
  }

  return { channelLinkUrl, itemLinkUrl, subsectionUrl };
}

function ClickableTitle({
  title,
  url,
  onClick,
  className,
  children,
}: {
  title: string;
  url: string;
  onClick: () => void;
  className: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Link href={url} onClick={onClick}>
        {children || title}
      </Link>
    </div>
  );
}

export const MediaPlayerInfoModal: React.FC = () => {
  const { mpChannel, mpItem, mpClip, mpItemChapter, mpItemSoundbite, setPlayerModalIsOpen } = useMediaPlayer();
  const tMediaPlayer = useTranslations("media_player");
  const tMisc = useTranslations("misc");
  const router = useRouter();

  const { channelLinkUrl, itemLinkUrl, subsectionUrl } = useLinkHelper({
    mpChannel,
    mpItem,
    mpClip,
    mpItemChapter,
    mpItemSoundbite,
  });

  const channel_image = findDTOChannelImageBySize(mpChannel?.channel_images, 'largest');
  const item_image = findDTOItemImageBySize(mpItem?.item_images, 'largest');
  const defaultImageUrl = item_image?.url || channel_image?.url || undefined;
  let imageUrl = '';
  
  if (mpItemChapter) {
    imageUrl = mpItemChapter.img || defaultImageUrl || '';
  } else {
    imageUrl = defaultImageUrl || '';
  }

  return (
    <div className={styles.info}>
      <div className={styles.titleSection}>
        <ClickableTitle
          title={mpItem?.title || tMisc("untitled")}
          url={itemLinkUrl}
          className={styles.itemTitle}
          onClick={() => {
            router.push(itemLinkUrl);
            setPlayerModalIsOpen(false);
          }}
        />
        <ClickableTitle
          title={mpChannel?.title || tMisc("untitled")}
          url={channelLinkUrl}
          className={styles.channelTitle}
          onClick={() => {
            router.push(channelLinkUrl);
            setPlayerModalIsOpen(false);
          }}
        />
      </div>
      <div className={styles.imageWrapper}>
        <img
          className={styles.image}
          src={imageUrl}
          alt={tMediaPlayer("media_player_image")}
        />
      </div>
      <div className={styles.subtitleSection}>
        {mpClip && (
          <>
            <ClickableTitle
              title={mpClip?.title || tMisc("untitled")}
              url={subsectionUrl}
              className={styles.subtitle}
              onClick={() => {
                router.push(subsectionUrl);
                setPlayerModalIsOpen(false);
              }}
            />
            <div className={styles.timeRange}>
              <ReadableTimeRange
                startTime={mpClip?.start_time}
                endTime={mpClip?.end_time}
              />
            </div>
          </>
        )}
        {mpItemSoundbite && (
          <>
            <ClickableTitle
              title={mpItemSoundbite?.title || tMisc("untitled")}
              url={subsectionUrl}
              className={styles.subtitle}
              onClick={() => {
                router.push(subsectionUrl);
                setPlayerModalIsOpen(false);
              }}
            />
            <div className={styles.timeRange}>
              <ReadableTimeRange
                startTime={mpItemSoundbite?.start_time}
                endTime={`${Number(mpItemSoundbite.start_time) + Number(mpItemSoundbite.duration)}`}
              />
            </div>
          </>
        )}
        {mpItemChapter && !mpClip && !mpItemSoundbite && (
          <>
            <ClickableTitle
              title={mpItemChapter?.title || tMisc("untitled")}
              url={subsectionUrl}
              className={styles.subtitle}
              onClick={() => {
                router.push(subsectionUrl);
                setPlayerModalIsOpen(false);
              }}
            />
            <div className={styles.timeRange}>
              <ReadableTimeRange
                startTime={mpItemChapter?.start_time}
                endTime={mpItemChapter?.end_time}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

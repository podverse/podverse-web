"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import { DTOChannel, DTOItem, findDTOChannelImageBySize, findDTOItemImageBySize,
  formatDateAbbrev } from "podverse-helpers";
import { Image } from "../../../Image/Image";
import { ROUTES } from "../../../../constants/routes";
import { IMAGES } from "../../../../constants/images";
import styles from "../../../../styles/components/List/ListGridNode.module.scss";

interface Props {
  channel: DTOChannel;
	item: DTOItem;
}

export const ListEpisodeGridNode: React.FC<Props> = ({ channel, item }) => {
  const url = `${ROUTES.EPISODE}/${item.id_text}`;
  const channel_image = findDTOChannelImageBySize(channel.channel_images, IMAGES.LIST.EPISODES.DESKTOP.SIZE_FIND_TARGET, 'lesser');
  const item_image = findDTOItemImageBySize(item.item_images, IMAGES.LIST.EPISODES.DESKTOP.SIZE_FIND_TARGET, 'lesser');
	const tMedia = useTranslations("media");
	const locale = useLocale();

	return (
		<Link href={url} className={styles.link}>
			<div className={styles.gridNode}>
				<Image
					src={item_image?.url || channel_image?.url}
					alt={item.title || tMedia("podcast.episode_image")}
					width={IMAGES.LIST.GRID.SIZE}
					height={IMAGES.LIST.GRID.SIZE}
					className={styles.image}
				/>
        <div className={styles.title}>{item.title}</div>
				{item.pub_date && (
					<span className={styles.lastPubDate}>
						{formatDateAbbrev(item.pub_date, locale)}
					</span>
				)}
			</div>
		</Link>
	);
};

"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import { DTOChannel, findDTOChannelImageBySize, formatDateAbbrev } from "podverse-helpers";
import { Image } from "../../Image/Image";
import { ROUTES } from "../../../constants/routes";
import { IMAGES } from "../../../constants/images";
import styles from "../../../styles/components/List/Podcasts/ListPodcastGridNode.module.scss";

interface Props {
	channel: DTOChannel;
}

const ListPodcastGridNode: React.FC<Props> = ({ channel }) => {
	const url = `${ROUTES.PODCAST}/${channel.id_text}`;
	const channel_image = findDTOChannelImageBySize(channel.channel_images, IMAGES.LIST.PODCASTS.SIZE_FIND_TARGET, 'lesser');
	const tMedia = useTranslations("media");
	const locale = useLocale();

	return (
		<Link href={url} className={styles.link}>
			<div className={styles.gridNode}>
				<Image
					src={channel_image?.url}
					alt={channel.title || tMedia("podcast.podcast_image")}
					width={IMAGES.LIST.GRID.SIZE}
					height={IMAGES.LIST.GRID.SIZE}
					className={styles.image}
				/>
        <div className={styles.title}>{channel.title}</div>
				{channel.channel_about?.last_pub_date && (
					<span className={styles.lastPubDate}>
						{formatDateAbbrev(channel.channel_about.last_pub_date, locale)}
					</span>
				)}
			</div>
		</Link>
	);
};

export default ListPodcastGridNode;

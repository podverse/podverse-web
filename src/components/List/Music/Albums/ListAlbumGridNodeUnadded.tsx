"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import { PodcastBatchByFeedGuidResponse } from "podverse-helpers";
import { Image } from "../../../Image/Image";
import { ROUTES } from "../../../../constants/routes";
import { IMAGES } from "../../../../constants/images";
import styles from "../../../../styles/components/List/ListGridNode.module.scss";

interface Props {
	channelUnadded: PodcastBatchByFeedGuidResponse['feeds'][number];
}

export const ListAlbumGridNodeUnadded: React.FC<Props> = ({ channelUnadded }) => {
	const url = `${ROUTES.PODCAST_INDEX}/feed/${channelUnadded.id}`;
	const tMedia = useTranslations("media");
	const tMisc = useTranslations("misc");

	return (
		<Link href={url} className={styles.link}>
			<div className={styles.gridNode}>
				<Image
					src={channelUnadded.image}
					alt={channelUnadded.title || tMedia("music.album_image")}
					width={IMAGES.LIST.GRID.SIZE}
					height={IMAGES.LIST.GRID.SIZE}
					className={styles.image}
				/>
        <div className={styles.title}>{channelUnadded.title}</div>
				{channelUnadded.author && (
					<span className={styles.lastPubDate}>
						{channelUnadded.author || tMisc("untitled")}
					</span>
				)}
			</div>
		</Link>
	);
};

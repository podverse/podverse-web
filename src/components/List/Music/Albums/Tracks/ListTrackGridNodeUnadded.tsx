"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import { EpisodeByGuidResponse } from "podverse-helpers";
import { Image } from "../../../../Image/Image";
import { ROUTES } from "../../../../../constants/routes";
import { IMAGES } from "../../../../../constants/images";
import styles from "../../../../../styles/components/List/ListGridNode.module.scss";

interface Props {
  itemUnadded: NonNullable<EpisodeByGuidResponse['episode']>;
  showChannelInfo?: boolean;
}

export const ListTrackGridNodeUnadded: React.FC<Props> = ({ itemUnadded, showChannelInfo }) => {
  const url = `${ROUTES.PODCAST_INDEX}/feed/${itemUnadded.feedId}`;
	const tMedia = useTranslations("media");
	const tMisc = useTranslations("misc");
	
	return (
		<Link href={url} className={styles.link}>
			<div className={styles.gridNode}>
				<Image
					src={itemUnadded.image}
					alt={itemUnadded.title || tMedia("music.track_image")}
					width={IMAGES.LIST.GRID.SIZE}
					height={IMAGES.LIST.GRID.SIZE}
					className={styles.image}
				/>
        <div className={styles.title}>{itemUnadded.title}</div>
				{showChannelInfo && (
					<>
						<span className={styles.lastPubDate}>
							{itemUnadded.feedTitle || tMisc("untitled")}
						</span>
					</>
				)}
			</div>
		</Link>
	);
};

"use client";

import { useTranslations } from "next-intl";
import { DTOChannel, findDTOChannelImageBySize } from "podverse-helpers";
import Image from "../../../components/Image/Image";
import { IMAGES } from "../../../constants/images";

type PodcastHeaderImageProps = {
  channel: DTOChannel;
};

export const PodcastHeaderImage = ({ channel }: PodcastHeaderImageProps) => {
  const channel_image = findDTOChannelImageBySize(channel.channel_images, IMAGES.HEADER.SQUARE.SIZE_FIND_TARGET, 'greater');
  const tMedia = useTranslations("media");
  
  return (
    <Image
      src={channel_image?.url}
      alt={channel.title || tMedia("podcast.podcast_image")}
      width={IMAGES.HEADER.SQUARE.SIZE}
      height={IMAGES.HEADER.SQUARE.SIZE}
    />
  );
}

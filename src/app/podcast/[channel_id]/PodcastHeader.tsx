import { DTOChannel } from "podverse-helpers";
import React from "react";
import HeaderPodcast from "../../../components/Header/HeaderPodcast";

type PodcastHeaderProps = {
  ssrChannel: DTOChannel;
};

const PodcastHeader: React.FC<PodcastHeaderProps> = ({ ssrChannel }) => {
  return (
    <HeaderPodcast channel={ssrChannel} />
  );
};

export default PodcastHeader;

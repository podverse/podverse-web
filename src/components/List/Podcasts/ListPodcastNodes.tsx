"use client";

import React from "react";
import { DTOChannel } from "podverse-helpers";
import { ListPodcastRow } from "./ListPodcastRow";
import { ListPodcastGridNode } from "./ListPodcastGridNode";
import { ViewSelectedOption } from "../../ViewSelector/ViewSelector";
import { Divider } from "../../Divider/Divider";
import styles from "../../../styles/components/List/Podcasts/ListPodcasts.module.scss";

interface Params {
  channels: DTOChannel[];
  viewSelected: ViewSelectedOption;
}

export function ListPodcastNodes({ channels, viewSelected }: Params): React.ReactNode[] {
  if (viewSelected === "rows") {
    return channels.map((channel, idx) => (
      <React.Fragment key={channel.id}>
        <ListPodcastRow channel={channel} />
        {idx < channels.length - 1 && <Divider />}
      </React.Fragment>
    ));
  }

  if (viewSelected === "grid") {
    return [
      <div key="grid" className={styles.grid}>
        {channels.map(channel => (
          <ListPodcastGridNode key={channel.id} channel={channel} />
        ))}
      </div>
    ];
  }

  return [];
}

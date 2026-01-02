"use client";

import React from "react";
import { DTOChannel } from "podverse-helpers";
import { ListArtistRow } from "./ListArtistRow";
import { ListArtistGridNode } from "./ListArtistGridNode";
import { ViewSelectedOption } from "../../../ViewSelector/ViewSelector";
import { Divider } from "../../../Divider/Divider";
import styles from "../../../../styles/components/List/ListNodes.module.scss";

interface Params {
  channels: DTOChannel[];
  viewSelected: ViewSelectedOption;
}

export function ListArtistNodes({ channels, viewSelected }: Params): React.ReactNode {
  if (viewSelected === "rows") {
    return (
      <div key="list" className={styles.list} style={{ gap: '0.125rem' }}>
        {
          channels.map((channel, idx) => (
            <React.Fragment key={channel.id}>
              <ListArtistRow channel={channel} />
              {idx < channels.length - 1 && <Divider />}
            </React.Fragment>
          ))
        }
      </div>
    );
  }

  if (viewSelected === "grid") {
    return (
      <div key="grid" className={styles.grid}>
        {channels.map(channel => (
          <ListArtistGridNode key={channel.id} channel={channel} />
        ))}
      </div>
    );
  }

  return null;
}

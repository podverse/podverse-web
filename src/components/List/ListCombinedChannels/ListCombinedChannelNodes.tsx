"use client";

import React from "react";
import { DTOChannel, QueryParamsMedium } from "podverse-helpers";
import { ListCombinedChannelRow } from "./ListCombinedChannelRow";
import { ListCombinedChannelGridNode } from "./ListCombinedChannelGridNode";
import { ViewSelectedOption } from "../../ViewSelector/ViewSelector";
import { Divider } from "../../Divider/Divider";
import styles from "../../../styles/components/List/ListNodes.module.scss";

interface Params {
  channels: DTOChannel[];
  viewSelected: ViewSelectedOption;
  filterMedium: QueryParamsMedium;
}

export function ListCombinedChannelNodes({ channels, viewSelected, filterMedium }: Params): React.ReactNode {
  if (viewSelected === "rows") {
    return (
      <div key="list" className={styles.list} style={{ gap: '0.125rem' }}>
        {
          channels.map((channel, idx) => (
            <React.Fragment key={channel.id}>
              <ListCombinedChannelRow channel={channel} filterMedium={filterMedium} />
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
          <ListCombinedChannelGridNode key={channel.id} channel={channel} filterMedium={filterMedium} />
        ))}
      </div>
    );
  }

  return null;
}

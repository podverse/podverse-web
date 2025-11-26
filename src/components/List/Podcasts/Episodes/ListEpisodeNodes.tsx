"use client";

import React from "react";
import { DTOChannel, DTOItem } from "podverse-helpers";
import { ViewSelectedOption } from "../../../ViewSelector/ViewSelector";
import { ListLiveItemRow } from "../../LiveItem/ListLiveItemRow";
import { Divider } from "../../../Divider/Divider";
import ListEpisodeRow from "./ListEpisodeRow";
import { ListEpisodeGridNode } from "./ListEpisodeGridNode";
import styles from "../../../../styles/components/List/ListNodes.module.scss";

interface Params {
  channel: DTOChannel | null;
  items: DTOItem[];
  viewSelected: ViewSelectedOption;
}

export function ListEpisodeNodes({ channel, items, viewSelected }: Params): React.ReactNode {
  const filteredItems = items.filter((item): item is DTOItem & { channel: DTOChannel } => (channel ? true : !!item.channel));

  if (viewSelected === "rows") {
    return (
      <div key="list" className={styles.list}>
        {
          filteredItems.map((item, idx) => {
            const rowChannel = channel || item.channel;
            return (
              <React.Fragment key={item.id}>
                {item.live_item ? (
                  <ListLiveItemRow channel={rowChannel} item={item} live_item={item.live_item} />
                ) : (
                  <ListEpisodeRow channel={rowChannel} item={item} />
                )}
                {idx < items.length - 1 && <Divider />}
              </React.Fragment>
            );
          })
        }
      </div>
    );
  }

  if (viewSelected === "grid") {
    return (
      <div key="grid" className={styles.grid}>
        {filteredItems.map(item => {
          const rowChannel = channel || item.channel;
          return <ListEpisodeGridNode key={item.id} channel={rowChannel} item={item} />;
        })}
      </div>
    );
  }

  return null;
}

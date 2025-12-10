"use client";

import React from "react";
import { DTOChannel, DTOItem } from "podverse-helpers";
import { ViewSelectedOption } from "../../ViewSelector/ViewSelector";
import { ListLiveItemRow } from "./ListLiveItemRow";
import { Divider } from "../../Divider/Divider";
import { ListLiveItemGridNode } from "./ListLiveItemGridNode";
import styles from "../../../styles/components/List/ListNodes.module.scss";

interface Params {
  items: DTOItem[];
  viewSelected: ViewSelectedOption;
  showChannelInfo?: boolean;
}

export function ListLiveItemNodes({ items, viewSelected, showChannelInfo }: Params): React.ReactNode {
  const filteredItems = items.filter((item): item is DTOItem & { channel: DTOChannel } => !!item.channel);

  if (viewSelected === "rows") {
    return (
      <div key="list" className={styles.list}>
        {
          filteredItems.map((item, idx) => {
            const rowChannel = item.channel;
            return (
              <React.Fragment key={item.id}>
                {item.live_item &&
                  <ListLiveItemRow
                    channel={rowChannel}
                    item={item}
                    live_item={item.live_item}
                    showChannelInfo={showChannelInfo}
                  />
                }
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
          const rowChannel = item.channel;
          return (
            item.live_item &&
            <ListLiveItemGridNode
              key={item.id}
              channel={rowChannel}
              item={item}
              live_item={item.live_item}
              showChannelInfo={showChannelInfo}
            />
          );
        })}
      </div>
    );
  }

  return null;
}

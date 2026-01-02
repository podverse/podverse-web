"use client";

import React from "react";
import { DTOItem, EpisodeByGuidResponse } from "podverse-helpers";
import { ViewSelectedOption } from "../../../../ViewSelector/ViewSelector";
import { ListLiveItemRow } from "../../../LiveItem/ListLiveItemRow";
import { Divider } from "../../../../Divider/Divider";
import { ListTrackRow } from "./ListTrackRow";
import { ListTrackGridNode } from "./ListTrackGridNode";
import { ListTrackRowRemoteItemUnadded } from "./ListTrackRowRemoteItemUnadded";
import { ListTrackGridNodeUnadded } from "./ListTrackGridNodeUnadded";
import styles from "../../../../../styles/components/List/ListNodes.module.scss";

interface Params {
  itemsAdded: DTOItem[];
  itemsUnadded: NonNullable<EpisodeByGuidResponse['episode']>[];
  viewSelected: ViewSelectedOption;
  showChannelInfo?: boolean;
}

export function ListTrackRemoteItemNodes({ itemsAdded, itemsUnadded, viewSelected, showChannelInfo }: Params): React.ReactNode {
  if (viewSelected === "rows") {
    return (
      <div key="list" className={styles.listTracks}>
        {
          itemsAdded.map((itemAdded, idx) => {
            const rowChannel = itemAdded.channel!;
            return (
              <React.Fragment key={itemAdded.id}>
                {itemAdded.live_item ? (
                  <ListLiveItemRow channel={rowChannel} item={itemAdded} live_item={itemAdded.live_item} showChannelInfo={showChannelInfo} showLiveItemStatus />
                ) : (
                  <ListTrackRow channel={rowChannel} item={itemAdded} showChannelInfo={showChannelInfo} playlist_id_text={null} />
                )}
                {idx < itemsAdded.length - 1 && <Divider />}
              </React.Fragment>
            );
          })
        }
        {
          itemsUnadded.map((itemUnadded, idx) => (
            <React.Fragment key={itemUnadded.guid}>
              <ListTrackRowRemoteItemUnadded itemUnadded={itemUnadded} showChannelInfo={showChannelInfo} />
              {idx < itemsUnadded.length - 1 && <Divider />}
            </React.Fragment>           
          ))
        }
      </div>
    );
  }

  if (viewSelected === "grid") {
    return (
      <div key="grid" className={styles.grid}>
        {itemsAdded.map(itemAdded => {
          const rowChannel = itemAdded.channel!;
          return (
            <ListTrackGridNode
              key={itemAdded.id}
              channel={rowChannel}
              item={itemAdded}
              showChannelInfo={showChannelInfo}
            />
          );
        })}
        {itemsUnadded.map(itemUnadded => {
          return (
            <ListTrackGridNodeUnadded
              key={itemUnadded.guid}
              itemUnadded={itemUnadded}
              showChannelInfo={showChannelInfo}
            />
          );
        })}
      </div>
    );
  }

  return null;
}

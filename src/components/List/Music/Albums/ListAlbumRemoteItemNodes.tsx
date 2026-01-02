"use client";

import React from "react";
import { DTOChannel, PodcastBatchByFeedGuidResponse } from "podverse-helpers";
import { ListAlbumRow } from "./ListAlbumRow";
import { ListAlbumGridNode } from "./ListAlbumGridNode";
import { ListAlbumRowRemoteItemUnadded } from "./ListAlbumRowRemoteItemUnadded";
import { ListAlbumGridNodeUnadded } from "./ListAlbumGridNodeUnadded";
import { ViewSelectedOption } from "../../../ViewSelector/ViewSelector";
import { Divider } from "../../../Divider/Divider";
import styles from "../../../../styles/components/List/ListNodes.module.scss";

interface Params {
  channelsAdded: DTOChannel[];
  channelsUnadded: PodcastBatchByFeedGuidResponse['feeds'];
  viewSelected: ViewSelectedOption;
}

export function ListAlbumRemoteItemNodes({ channelsAdded, channelsUnadded, viewSelected }: Params): React.ReactNode {  
  if (viewSelected === "rows") {
    return (
      <div key="list" className={styles.list} style={{ gap: '0.125rem' }}>
        {
          channelsAdded.map((channelAdded, idx) => (
            <React.Fragment key={channelAdded.id}>
              <ListAlbumRow channel={channelAdded} />
              {idx < channelsAdded.length - 1 && <Divider />}
            </React.Fragment>
          ))
        }
        {
          channelsUnadded.map((channelUnadded, idx) => (
            <React.Fragment key={channelUnadded.id}>
              <ListAlbumRowRemoteItemUnadded channelUnadded={channelUnadded} />
              {idx < channelsUnadded.length - 1 && <Divider />}
            </React.Fragment>
          ))
        }
      </div>
    );
  }

  if (viewSelected === "grid") {
    return (
      <div key="grid" className={styles.grid}>
        {
          channelsAdded.map(channelAdded => (
            <ListAlbumGridNode key={channelAdded.id} channel={channelAdded} />
          ))
        }
        {
          channelsUnadded.map(channelUnadded => (
            <ListAlbumGridNodeUnadded key={channelUnadded.id} channelUnadded={channelUnadded} />
          ))
        }
      </div>
    );
  }

  return null;
}

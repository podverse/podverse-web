"use client";

import { CategoryMappingKeys, DTOChannel, DTOItem, DTOItemSoundbite, QueryParamsItemsType } from "podverse-helpers";
import React from "react";
import { ListItemSoundbiteRow } from "./ListItemSoundbiteRow";
import Pagination from "../../Pagination/Pagination";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { scrollMainToTop } from "../../../utils/scroll";

type Props = {
  page: number;
  setPage: (page: number) => void;
  channel: DTOChannel;
  item: DTOItem | null;
  itemSoundbites: DTOItemSoundbite[];
  totalPages: number;
  showSubscribeMessage?: boolean;
  type?: QueryParamsItemsType;
  category?: CategoryMappingKeys | null;
  showItemInfo?: boolean;
};

export const ListItemSoundbites: React.FC<Props> = ({ page = 1, setPage,
  channel, item, itemSoundbites, totalPages, showSubscribeMessage, showItemInfo }) => {

  useSkipInitialEffect(() => {
    scrollMainToTop();
  }, [itemSoundbites]);
  
  const showPagination = !showSubscribeMessage;

  return (
    <>
      {
        showPagination && (
          <Pagination
            currentPage={page}
            maxButtons={5}
            totalPages={totalPages}
            setPage={setPage}>
            {itemSoundbites.map((item_soundbite) => (
              <ListItemSoundbiteRow
                key={item_soundbite.id}
                channel={channel}
                item={item}
                item_soundbite={item_soundbite}
                showItemInfo={showItemInfo} />
            ))}
          </Pagination>
        )
      }
    </>
  );
};

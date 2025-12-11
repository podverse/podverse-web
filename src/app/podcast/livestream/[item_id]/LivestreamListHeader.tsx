"use client";

import { useTranslations } from "next-intl";
import {
  QueryParamsLiveItemType,
  QUERY_PARAMS_LIVE_ITEM_TYPE_VALUES,
} from "podverse-helpers";
import React from "react";
import { ListHeader } from "../../../../components/List/ListHeader";
import { useLivestreamContext } from "./LivestreamContext";
import { Tabs } from "../../../../components/Tabs/Tabs";

export const LivestreamListHeader: React.FC = () => {
  const { filterParams, setFilterParams } = useLivestreamContext();
  const { type } = filterParams;
  const tInfo = useTranslations('info');

  function isLiveItemType(val: string): val is QueryParamsLiveItemType {
    return QUERY_PARAMS_LIVE_ITEM_TYPE_VALUES.includes(val as QueryParamsLiveItemType);
  }

  const handleTypeChange = (value: string) => {
    if (isLiveItemType(value)) {
      setFilterParams({ ...filterParams, type: value });
    }
  };

  const tabData = [{
    key: "summary",
    label: tInfo("summary.summary"),
    onClick: () => handleTypeChange("summary"),
    zIndex: 5
  }];

  return (
    <ListHeader
      tabs={
        <Tabs
          tabData={tabData}
          selectedKey={type ?? ""}
        />
      }
    />
  );
};

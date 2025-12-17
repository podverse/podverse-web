"use client";

import { useTranslations } from "next-intl";
import {
  QueryParamsItemMusicType,
  QUERY_PARAMS_ITEM_MUSIC_TYPE_VALUES,
} from "podverse-helpers";
import React from "react";
import { ListHeader } from "../../../components/List/ListHeader";
import { useTrackContext } from "./TrackContext";
import { Tabs } from "../../../components/Tabs/Tabs";
import { Button } from "../../../components/Button/Button";

type TrackListHeaderProps = {
  ssrHasTranscripts: boolean;
};

export const TrackListHeader: React.FC<TrackListHeaderProps> = ({ ssrHasTranscripts }) => {
  const { filterParams, setFilterParams, autoScrollOn,
    setAutoScrollOn } = useTrackContext();
  const { type } = filterParams;
  const tInfo = useTranslations('info');
  const tMisc = useTranslations('misc');

  function isItemType(val: string): val is QueryParamsItemMusicType {
    return QUERY_PARAMS_ITEM_MUSIC_TYPE_VALUES.includes(val as QueryParamsItemMusicType);
  }

  const handleTypeChange = (value: string) => {
    if (isItemType(value)) {
      setFilterParams({ ...filterParams, type: value });
    }
  };

  const tabData = [{
    key: "summary",
    label: tInfo("summary.summary"),
    onClick: () => handleTypeChange("summary"),
    zIndex: 5
  }];

  if (ssrHasTranscripts) {
    tabData.push({
      key: "transcript",
      label: tInfo("transcript.lyrics"),
      onClick: () => handleTypeChange("transcript"),
      zIndex: 1
    });
  }

  let sideButtons: React.ReactNode = null;

  if (type === "transcript") {
    sideButtons = (
      <Button
        onClick={() => setAutoScrollOn(!autoScrollOn)}
        variant="mini"
      >
        {autoScrollOn
          ? tMisc("autoscroll.autoscroll_on")
          : tMisc("autoscroll.autoscroll_off")}
      </Button>
    );
  }

  return (
    <ListHeader
      tabs={
        <Tabs
          tabData={tabData}
          selectedKey={type ?? ""}
        />
      }
      sideButtons={sideButtons}
    />
  );
};

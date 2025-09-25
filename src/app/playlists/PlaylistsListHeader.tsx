"use client";

import { useTranslations } from "next-intl";
import {
  QueryParamsStatsRange,
  QUERY_PARAMS_STATS_RANGE_VALUES,
  QUERY_PARAMS_PLAYLISTS_TYPE_VALUES,
  QueryParamsPlaylistsType,
  QueryParamsPlaylistsSort,
  QUERY_PARAMS_PLAYLISTS_SORT_VALUES,
  MediumEnum,
} from "podverse-helpers";
import React from "react";
import Dropdown from "../../components/Dropdown/Dropdown";
import ListHeader from "../../components/List/ListHeader";
import { getPlaylistsDropdownConfig } from "./PlaylistsDropdownConfig";
import { Tabs } from "../../components/Tabs/Tabs";
import { usePlaylistsContext } from "./PlaylistsContext";
import { ButtonTabs } from "../../components/Tabs/ButtonTabs";

export const PlaylistsListHeader: React.FC = () => {
  const { filterParams, setFilterParams } = usePlaylistsContext();
  const { type, sort, range } = filterParams;
  const tFilters = useTranslations('filters');
  const tMedia = useTranslations('media');
  const tFeatures = useTranslations('features');
  const { sortMenuItems, rangeMenuItems, showRangeDropdown
    } = getPlaylistsDropdownConfig({ type, sort, tFilters });

  function isPlaylistType(val: string): val is QueryParamsPlaylistsType {
    return QUERY_PARAMS_PLAYLISTS_TYPE_VALUES.includes(val as QueryParamsPlaylistsType);
  }

  function isPlaylistSort(val: string): val is QueryParamsPlaylistsSort {
    return QUERY_PARAMS_PLAYLISTS_SORT_VALUES.includes(val as QueryParamsPlaylistsSort);
  }
  
  function isStatsRange(val: string): val is QueryParamsStatsRange {
    return QUERY_PARAMS_STATS_RANGE_VALUES.includes(val as QueryParamsStatsRange);
  }

  const handleTypeChange = (value: string) => {
    if (isPlaylistType(value)) {
      if (value === "global") {
        setFilterParams({ ...filterParams, type: value, sort: "top", page: 1 });
      } else if (value === "my_playlists") {
        setFilterParams({ ...filterParams, type: value, sort: "a_z", page: 1 });
      } else if (value === "subscribed") {
        setFilterParams({ ...filterParams, type: value, sort: "a_z", page: 1 });
      }
    }
  };

  const handleSortChange = (value: string) => {
    if (isPlaylistSort(value)) {
      setFilterParams({ ...filterParams, sort: value });
    }
  };

  const handleRangeChange = (value: string) => {
    if (isStatsRange(value)) {
      setFilterParams({ ...filterParams, range: value });
    }
  };

  const tabData = [
    {
      key: "my_playlists",
      label: tFeatures("playlist.my_playlists"),
      onClick: () => handleTypeChange("my_playlists"),
      zIndex: 3
    },
    {
      key: "subscribed",
      label: tFilters("type.subscribed"),
      onClick: () => handleTypeChange("subscribed"),
      zIndex: 2
    },
    {
      key: "global",
      label: tFilters("type.global"),
      onClick: () => handleTypeChange("global"),
      zIndex: 1
    }
  ]

  const filterDropdowns = [
    <Dropdown
      key="sort"
      value={sort ?? ""}
      menuItems={sortMenuItems}
      onChange={handleSortChange}
      position="right"
    />,
    showRangeDropdown && (
      <Dropdown
        key="range"
        value={range ?? ""}
        menuItems={rangeMenuItems}
        onChange={handleRangeChange}
        position="right"
      />
    )
  ]

  const buttonTabs = [
    {
      key: "all",
      label: tFilters("type.all"),
      onClick: () => setFilterParams({ ...filterParams, medium_id: null })
    },
    {
      key: MediumEnum.Podcast,
      label: tMedia("podcast.podcasts"),
      onClick: () => setFilterParams({ ...filterParams, medium_id: MediumEnum.Podcast })
    },
    {
      key: MediumEnum.Video,
      label: tMedia("video.videos"),
      onClick: () => setFilterParams({ ...filterParams, medium_id: MediumEnum.Video })
    },
    {
      key: MediumEnum.Music,
      label: tMedia("music.music"),
      onClick: () => setFilterParams({ ...filterParams, medium_id: MediumEnum.Music })
    }
  ]

  return (
    <ListHeader
      tabs={
        <Tabs
          tabData={tabData}
          selectedKey={type ?? ""}
        />
      }
      filterDropdowns={filterDropdowns}
      buttonTabs={(
        <ButtonTabs
          buttonTabs={buttonTabs}
          selectedKey={filterParams.medium_id ?? "all"}
        />
      )}
    />
  );
};

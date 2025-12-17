import { QueryParamsItemMusicType } from "podverse-helpers";

type TrackDropdownConfigParams = {
  type: QueryParamsItemMusicType;
}

export type TrackDropdownConfigCurrentParams = {
  currentType: QueryParamsItemMusicType;
}

export function getTrackFilterParams({ type }: TrackDropdownConfigParams): TrackDropdownConfigCurrentParams {
  let currentType = type;

  return { currentType };
}

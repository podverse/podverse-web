import { QueryParamsChannelMusicArtistType } from "podverse-helpers";

type ArtistDropdownConfigParams = {
  type: QueryParamsChannelMusicArtistType;
}

export type ArtistDropdownConfigCurrentParams = {
  currentType: QueryParamsChannelMusicArtistType;
}

export function getArtistFilterParams({ type }: ArtistDropdownConfigParams): ArtistDropdownConfigCurrentParams {
  let currentType = type;
  return { currentType };
}

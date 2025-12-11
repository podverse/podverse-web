import { QueryParamsLiveItemType } from "podverse-helpers";

type LivestreamDropdownConfigParams = {
  type: QueryParamsLiveItemType;
}

export type LivestreamDropdownConfigCurrentParams = {
  currentType: QueryParamsLiveItemType;
}

export function getLivestreamFilterParams({ type }: LivestreamDropdownConfigParams): LivestreamDropdownConfigCurrentParams {
  let currentType = type;

  return { currentType };
}

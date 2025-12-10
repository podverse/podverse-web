import React from "react";
import z from "zod";
import { ApiListResponse, CATEGORY_MAPPING_KEYS, DTOClip, getTotalPages,
  QUERY_PARAMS_STATS_RANGE_VALUES, QUERY_PARAMS_SUBSCRIBED_PARTIAL_SORT,
  QUERY_PARAMS_SUBSCRIBED_TYPE, QueryParamsMedium} from "podverse-helpers";
import { getSSRAuthService } from "../../utils/auth/ssrAuth";
import { ClipsClient } from "./ClipsClient";
import { EpisodesDropdownConfigCurrentParams, getEpisodesFilterParams } from "../episodes/EpisodesDropdownConfig";

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional().default("1"),
  type: z.enum(QUERY_PARAMS_SUBSCRIBED_TYPE).optional().nullable().default(null),
  sort: z.enum(QUERY_PARAMS_SUBSCRIBED_PARTIAL_SORT).optional().nullable().default(null),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional().nullable().default(null),
  category: z.enum(CATEGORY_MAPPING_KEYS as [string, ...string[]]).optional().nullable().default(null),
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type ClipsPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ClipsPage({ searchParams }: ClipsPageProps) {
  const { isValidAuthSession, apiRequestService } = await getSSRAuthService();
    
  const queryParams = await searchParams;
  const { currentType, currentSort, currentRange, currentCategory, currentPage } =
    await parseSearchParams(queryParams, isValidAuthSession);
  

  const medium: QueryParamsMedium = "podcasts";

  let response: ApiListResponse<DTOClip> = await apiRequestService.reqClipGetManyPublic({
    page: currentPage,
    medium,
    type: currentType,
    sort: currentSort,
    range: currentRange,
    category: currentCategory
  });

  const ssrClips = response.data;
  const ssrTotalPages = getTotalPages(response.meta.count, response.meta.limit, response.data.length, currentPage);

  return (
    <ClipsClient
      initialQueryParams={{
        page: currentPage,
        type: currentType,
        sort: currentSort,
        range: currentRange,
        category: currentCategory,
        medium
      }}
      ssrClips={ssrClips}
      ssrTotalPages={ssrTotalPages}
    />
  );
}

function parseSearchParams(queryParams: SearchParams,
  isAuthenticated: boolean): EpisodesDropdownConfigCurrentParams {
  const parsed = searchParamsSchema.safeParse(queryParams);

  if (!parsed.success) {
    return {
      currentType: isAuthenticated ? "subscribed" : "global",
      currentSort: isAuthenticated ? "recent" : "recent",
      currentRange: null,
      currentCategory: null,
      currentPage: 1
    };
  }

  const data = parsed.data;

  return getEpisodesFilterParams(data, isAuthenticated);
}

import {
  QUERY_PARAMS_STATS_RANGE_VALUES,
  getTotalPages,
  QUERY_PARAMS_SUBSCRIBED_TYPE,
  QUERY_PARAMS_SUBSCRIBED_FULL_SORT,
  QueryParamsSubscribedFullSort
} from "podverse-helpers";
import { cookies } from 'next/headers';
import { z } from "zod";
import { ProfilesClient } from "./ProfilesClient";
import { getProfilesFilterParams, ProfilesDropdownConfigCurrentParams } from "./ProfilesDropdownConfig";
import { getSSRAuthService } from "../../utils/auth/ssrAuth";
import { getParsedLocalSettings, ProfilesFilterDefaults } from '../../utils/localSettings/localSettings';

const searchParamsSchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional().default("1"),
  type: z.enum(QUERY_PARAMS_SUBSCRIBED_TYPE).optional().nullable().default(null),
  sort: z.enum(QUERY_PARAMS_SUBSCRIBED_FULL_SORT).optional().nullable().default(null),
  range: z.enum(QUERY_PARAMS_STATS_RANGE_VALUES).optional().nullable().default(null),
});

type SearchParams = z.infer<typeof searchParamsSchema>

export type ProfilesPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ProfilesPage({ searchParams }: ProfilesPageProps) {
  const { isValidAuthSession, ssrApiRequestService } = await getSSRAuthService();

  const cookieStore = await cookies();
  const ssrLocalSettings = getParsedLocalSettings(cookieStore);
  const ssrFilterDefaults = ssrLocalSettings.fd?.profiles;

  const queryParams = await searchParams;
  const { currentType, currentSort, currentRange, currentPage } =
    await parseSearchParams(queryParams, isValidAuthSession, ssrFilterDefaults);
  
  const response = await ssrApiRequestService.reqAccountGetMany({
    type: currentType,
    sort: currentSort,
    range: currentRange,
    page: currentPage
  });

  const ssrAccounts = response.data;
  const ssrTotalPages = getTotalPages(response.meta.count || response.data.length, response.meta.limit || 50, response.data.length, currentPage);
  
  return (
    <ProfilesClient
      initialQueryParams={{
        page: currentPage,
        type: currentType,
        sort: currentSort,
        range: currentRange
      }}
      ssrAccounts={ssrAccounts}
      ssrTotalPages={ssrTotalPages}
    />
  );
}

function parseSearchParams(
  queryParams: SearchParams,
  isAuthenticated: boolean,
  cookieDefaults?: ProfilesFilterDefaults
): ProfilesDropdownConfigCurrentParams {
  const parsed = searchParamsSchema.safeParse(queryParams);

  if (!parsed.success) {
    return {
      currentType: cookieDefaults?.type ?? (isAuthenticated ? "subscribed" : "global"),
      currentSort: cookieDefaults?.sort ?? (isAuthenticated ? "a_z" : "recent"),
      currentRange: cookieDefaults?.range ?? null,
      currentPage: 1
    };
  }

  const data = parsed.data;

  // Determine the type
  const resolvedType = data.type ?? cookieDefaults?.type ?? (isAuthenticated ? "subscribed" : "global");
  
  // For sort: if type is explicitly "subscribed" in URL and sort is null, don't use cookie default
  // Let getProfilesFilterParams default to "a_z" for subscribed type
  let resolvedSort: QueryParamsSubscribedFullSort | null;
  if (data.type === "subscribed" && data.sort === null) {
    // Type is explicitly subscribed, sort is not provided - pass null to use default
    resolvedSort = null;
  } else {
    // Use provided sort, or cookie default, or authentication-based default
    resolvedSort = data.sort ?? cookieDefaults?.sort ?? (isAuthenticated ? "a_z" : "recent");
  }

  return getProfilesFilterParams({
    page: data.page,
    type: resolvedType,
    sort: resolvedSort,
    range: data.range ?? cookieDefaults?.range ?? null
  }, isAuthenticated);
}

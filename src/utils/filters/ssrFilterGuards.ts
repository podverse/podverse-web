import { ApiListResponse } from "podverse-helpers";

type GuardSubscribedFilterParams<TType extends string, TSort extends string, TRange extends string, TCategory extends string> = {
  isAuthenticated: boolean;
  type: TType | null;
  sort?: TSort | null;
  range?: TRange | null;
  category?: TCategory | null;
  page?: number;
  fallback: {
    type: TType;
    sort?: TSort | null;
    range?: TRange | null;
    category?: TCategory | null;
    page?: number;
  };
};

type GuardedFilterParams<TType extends string, TSort extends string, TRange extends string, TCategory extends string> = {
  type: TType | null;
  sort: TSort | null;
  range: TRange | null;
  category: TCategory | null;
  page: number;
};

export function guardSubscribedSsrFilter<
  TType extends string,
  TSort extends string,
  TRange extends string,
  TCategory extends string
>(params: GuardSubscribedFilterParams<TType, TSort, TRange, TCategory>): GuardedFilterParams<TType, TSort, TRange, TCategory> {
  if (!params.isAuthenticated && params.type === "subscribed") {
    return {
      type: params.fallback.type,
      sort: params.fallback.sort ?? null,
      range: params.fallback.range ?? null,
      category: params.fallback.category ?? null,
      page: params.fallback.page ?? 1
    };
  }

  return {
    type: params.type,
    sort: params.sort ?? null,
    range: params.range ?? null,
    category: params.category ?? null,
    page: params.page ?? 1
  };
}

export async function safeSsrListRequest<T>(
  request: () => Promise<ApiListResponse<T>>,
  fallbackPage = 1
): Promise<ApiListResponse<T>> {
  try {
    return await request();
  } catch (err) {
    return {
      data: [],
      meta: {
        page: fallbackPage,
        count: 0,
        limit: 1
      }
    };
  }
}

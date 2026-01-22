export interface PageState<TParams, TData = unknown> {
  filterParams: TParams;
  data?: TData;
  scrollPosition: number;
  timestamp: number;
}

const CACHE_KEY_PREFIX = "pv-page-state-";
const MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes

export function savePageState<TParams, TData = unknown>(
  routeKey: string,
  state: Omit<PageState<TParams, TData>, "timestamp">
) {
  if (typeof window === "undefined") return;
  
  const cacheKey = CACHE_KEY_PREFIX + routeKey;
  const stateWithTimestamp: PageState<TParams, TData> = {
    ...state,
    timestamp: Date.now(),
  };
  sessionStorage.setItem(cacheKey, JSON.stringify(stateWithTimestamp));
}

export function getPageState<TParams, TData = unknown>(
  routeKey: string
): PageState<TParams, TData> | null {
  if (typeof window === "undefined") return null;
  
  const cacheKey = CACHE_KEY_PREFIX + routeKey;
  const cached = sessionStorage.getItem(cacheKey);
  
  if (!cached) return null;
  
  try {
    const state: PageState<TParams, TData> = JSON.parse(cached);
    // Check if cache is still fresh
    if (Date.now() - state.timestamp > MAX_AGE_MS) {
      sessionStorage.removeItem(cacheKey);
      return null;
    }
    return state;
  } catch {
    return null;
  }
}

export function clearPageState(routeKey: string) {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CACHE_KEY_PREFIX + routeKey);
}

export function getScrollPosition(containerId = "mainOuterWrapper"): number {
  if (typeof window === "undefined") return 0;
  const el = document.getElementById(containerId);
  return el?.scrollTop ?? 0;
}

export function restoreScrollPosition(position: number, containerId = "mainOuterWrapper") {
  if (typeof window === "undefined") return;
  const el = document.getElementById(containerId);
  if (el) {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      el.scrollTo({ top: position });
    });
  }
}

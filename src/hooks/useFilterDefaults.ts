import { useEffect, useRef } from 'react';
import { FilterDefaultsPage, updateFilterDefaults } from '../utils/localSettings/localSettings';

/**
 * Hook to automatically update filter defaults in cookie when filter params change.
 * Only updates when non-page params change (type, sort, range, category, medium, liveItemType).
 */
export function useFilterDefaults(page: FilterDefaultsPage, filterParams: any) {
  const previousFilterParamsRef = useRef<any>(null);

  useEffect(() => {
    const prev = previousFilterParamsRef.current;
    const current = filterParams;

    // Skip on first render
    if (!prev) {
      previousFilterParamsRef.current = current;
      return;
    }

    // Only update cookie if non-page params changed
    // Page changes should not be persisted as default filter preference
    const paramsToCheck = ['type', 'sort', 'range', 'category', 'medium', 'liveItemType'];
    const didFiltersChange = paramsToCheck.some(
      param => prev[param] !== current[param]
    );

    if (didFiltersChange) {
      // Extract only the filter params, exclude page number
      const filterDefaults: any = {};
      paramsToCheck.forEach(param => {
        if (current[param] !== undefined) {
          filterDefaults[param] = current[param];
        }
      });

      updateFilterDefaults(page, filterDefaults);
    }

    previousFilterParamsRef.current = current;
  }, [page, filterParams]);
}

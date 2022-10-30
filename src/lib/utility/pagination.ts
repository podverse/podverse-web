import { PV } from '~/resources'

/*
  The counts returned by our endpoints are not always accurate.
  As a workaround, I'm determining when a final page has been reached
  using the items.length.
*/
export const determinePageCount = (page: number, items: any[], serverResponseCount: number, isSearch?: boolean) => {
  serverResponseCount = isSearch ? 1000 : serverResponseCount
  return page > 0 && items.length < 20 ? page : Math.ceil(serverResponseCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)
}

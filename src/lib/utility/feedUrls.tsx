export const getAuthorityFeedUrlFromArray = (feedUrls: any[]) => {
  if (!Array.isArray(feedUrls)) return null
  return feedUrls.find((feedUrl: any) => feedUrl.isAuthority)
}

export const opmlExport = (podcastList: any) => {
    const newOpml = jsonToXML(podcastList)
  
    return newOpml
    
    function escapeEntities(str: string) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
    }
    // need to fix podcast.url below
    function jsonToXML(json: any[]) {
  
      const filteredPodcasts = json.filter((podcast: any) =>
        podcast.title && (podcast.addByRSSPodcastFeedUrl || podcast.feedUrls && podcast.feedUrls[0])
      )
  
      return `
  <?xml version="1.0"?>
  <opml version="1.0">
    <head>
      <title>OPML exported from Podverse</title>
      <dateCreated>${new Date()}</dateCreated>
      <dateModified>${new Date()}</dateModified>
    </head>
    <body>
  ${filteredPodcasts.map((podcast: any) =>
    // eslint-disable-next-line max-len
    `    <outline text="${escapeEntities(podcast.title)}" type="rss" xmlUrl="${podcast.addByRSSPodcastFeedUrl || podcast.feedUrls[0].url}"/>`
  ).join('\n') }
    </body>
  </opml>
      `.trim()
    }
  }
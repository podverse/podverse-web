// const Filter = require('bad-words')
// const filter = new Filter()

const filter = {
  clean: (str) => str
}

export const sfwFilterPodcast = (podcast: any = {}) => {
  return {
    ...podcast,
    description: filter.clean(podcast.description),
    lastEpisodeTitle: filter.clean(podcast.lastEpisodeTitle),
    title: filter.clean(podcast.title)
  }
}

export const sfwFilterPodcasts = (podcastsAndCount: any[] = []) => {
  const filteredPodcasts: any[] = []
  for (const podcast of podcastsAndCount[0]) {
    filteredPodcasts.push(sfwFilterPodcast(podcast))
  }
  return [filteredPodcasts, podcastsAndCount[1]]
}

export const sfwFilterEpisode = (episode: any = {}) => {
  return {
    ...episode,
    description: filter.clean(episode.description),
    title: filter.clean(episode.title),
    podcast: {
      ...sfwFilterPodcast(episode.podcast)
    }
  }
}

export const sfwFilterEpisodes = (episodesAndCount: any[] = []) => {
  const filteredEpisodes: any[] = []
  for (const episode of episodesAndCount[0]) {
    filteredEpisodes.push(sfwFilterEpisode(episode))
  }
  return [filteredEpisodes, episodesAndCount[1]]
}

export const sfwFilterMediaRef = (mediaRef: any = {}) => {
  return {
    ...mediaRef,
    title: filter.clean(mediaRef.title),
    episode: {
      ...sfwFilterEpisode(mediaRef.episode)
    },
    ...(mediaRef.owner ? {
      owner: {
        ...sfwFilterUser(mediaRef.owner)
      }
    } : {})
  }
}

export const sfwFilterMediaRefs = (mediaRefsAndCount: any[] = []) => {
  const filteredMediaRefs: any[] = []
  for (const mediaRef of mediaRefsAndCount[0]) {
    filteredMediaRefs.push(sfwFilterMediaRef(mediaRef))
  }
  return [filteredMediaRefs, mediaRefsAndCount[1]]
}

export const sfwFilterPlaylist = (playlist: any = {}) => {
  return {
    ...playlist,
    description: filter.clean(playlist.description),
    title: filter.clean(playlist.title),
    episodes: sfwFilterEpisodes(playlist.episodes),
    mediaRefs: sfwFilterMediaRefs(playlist.mediaRefs),
    owner: sfwFilterUser(playlist.owner)
  }
}

export const sfwFilterPlaylists = (playlistsAndCount: any[] = []) => {
  const filteredPlaylists: any[] = []
  for (const playlist of playlistsAndCount[0]) {
    filteredPlaylists.push(sfwFilterPlaylist(playlist))
  }
  return [filteredPlaylists, playlistsAndCount[1]]
}

export const sfwFilterUser = (user: any = {}) => {
  return {
    ...user,
    name: filter.clean(user.name),
    mediaRefs: user.mediaRefs ? sfwFilterMediaRefs(user.mediaRefs) : [],
    playlists: user.playlists ? sfwFilterPlaylists(user.playlists) : []
  }
}

export const sfwFilterUsers = (usersAndCount: any[] = []) => {
  const filteredUsers: any[] = []
  for (const user of usersAndCount[0]) {
    filteredUsers.push(sfwFilterMediaRef(user))
  }
  return [filteredUsers, usersAndCount[1]]
}

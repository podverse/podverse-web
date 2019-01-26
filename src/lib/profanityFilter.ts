const Filter = require('bad-words')
const filter = new Filter()

export const sfwFilterPodcast = (podcast: any = {}) => {
  return {
    ...podcast,
    description: filter.clean(podcast.description),
    lastEpisodeTitle: filter.clean(podcast.lastEpisodeTitle),
    title: filter.clean(podcast.title)
  }
}

export const sfwFilterPodcasts = (podcasts: any[] = []) => {
  const filteredPodcasts: any[] = []
  for (const podcast of podcasts) {
    filteredPodcasts.push(sfwFilterPodcast(podcast))
  }
  return filteredPodcasts
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

export const sfwFilterEpisodes = (episodes: any[] = []) => {
  const filteredEpisodes: any[] = []
  for (const episode of episodes) {
    filteredEpisodes.push(sfwFilterEpisode(episode))
  }
  return filteredEpisodes
}

export const sfwFilterMediaRef = (mediaRef: any = {}) => {
  return {
    ...mediaRef,
    title: filter.clean(mediaRef.title),
    episode: {
      ...sfwFilterEpisode(mediaRef.episode)
    },
    owner: {
      ...sfwFilterUser(mediaRef.owner)
    }
  }
}

export const sfwFilterMediaRefs = (mediaRefs: any[] = []) => {
  const filteredMediaRefs: any[] = []
  for (const mediaRef of mediaRefs) {
    filteredMediaRefs.push(sfwFilterMediaRef(mediaRef))
  }
  return filteredMediaRefs
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

export const sfwFilterPlaylists = (playlists: any[] = []) => {
  const filteredPlaylists: any[] = []
  for (const playlist of playlists) {
    filteredPlaylists.push(sfwFilterPlaylist(playlist))
  }
  return filteredPlaylists
}

export const sfwFilterUser = (user: any = {}) => {
  return {
    ...user,
    name: filter.clean(user.name),
    mediaRefs: user.mediaRefs ? sfwFilterMediaRefs(user.mediaRefs) : [],
    playlists: user.playlists ? sfwFilterPlaylists(user.playlists) : []
  }
}

export const sfwFilterUsers = (users: any[] = []) => {
  const filteredUsers: any[] = []
  for (const user of users) {
    filteredUsers.push(sfwFilterMediaRef(user))
  }
  return filteredUsers
}

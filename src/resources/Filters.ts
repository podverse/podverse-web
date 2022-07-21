const _all = 'all'
const _category = 'category'
const _episode = 'episode'
const _podcast = 'podcast'
const _subscribed = 'subscribed'

const _host = 'host'

const _alphabetical = 'alphabetical'
const _chronological = 'chronological'
const _mostRecent = 'most-recent'
const _oldest = 'oldest'
const _random = 'random'
const _topPastDay = 'top-past-day'
const _topPastWeek = 'top-past-week'
const _topPastMonth = 'top-past-month'
const _topPastYear = 'top-past-year'
const _topAllTime = 'top-all-time'

const _chapters = 'chapters'
const _clips = 'clips'
const _episodes = 'episodes'
const _myClips = 'my-clips'
const _myPlaylists = 'my-playlists'
const _playlists = 'playlists'
const _podcasts = 'podcasts'

type DropdownOption = {
  label: string
  key: string
}

export const isNotAllSortOption = (selectedKey: string) => {
  const allowedKeys = Filters.dropdownOptions.podcasts.sort.all
  return !allowedKeys.find((option: DropdownOption) => option.key === selectedKey)
}

export const isNotPodcastsSubscribedSortOption = (selectedKey: string) => {
  const allowedKeys = Filters.dropdownOptions.podcasts.sort.subscribed
  return !allowedKeys.find((option: DropdownOption) => option.key === selectedKey)
}

export const isNotClipsSortOption = (selectedKey: string) => {
  const allowedKeys = Filters.dropdownOptions.clips.sort.subscribed
  return !allowedKeys.find((option: DropdownOption) => option.key === selectedKey)
}

export const Filters = {
  from: {
    _all,
    _category,
    _episode,
    _podcast,
    _subscribed
  },
  search: {
    queryParams: {
      host: _host,
      podcast: _podcast
    }
  },
  sort: {
    _alphabetical,
    _chronological,
    _mostRecent,
    _oldest,
    _random,
    _topPastDay,
    _topPastWeek,
    _topPastMonth,
    _topPastYear,
    _topAllTime
  },
  type: {
    _chapters,
    _clips,
    _episodes,
    _myClips,
    _myPlaylists,
    _playlists,
    _podcasts
  },
  dropdownOptions: {
    clip: {
      sort: [
        { i18nKey: 'filter sorting - chronological', key: _chronological },
        { i18nKey: 'filter sorting - most-recent', key: _mostRecent },
        { i18nKey: 'filter sorting - top-past-day', key: _topPastDay },
        { i18nKey: 'filter sorting - top-past-week', key: _topPastWeek },
        { i18nKey: 'filter sorting - top-past-month', key: _topPastMonth },
        { i18nKey: 'filter sorting - top-past-year', key: _topPastYear },
        { i18nKey: 'filter sorting - top-all-time', key: _topAllTime },
        { i18nKey: 'filter sorting - oldest', key: _oldest },
        { i18nKey: 'filter sorting - random', key: _random }
      ]
    },
    clips: {
      from: [
        { i18nKey: 'filter from - all', i18nAriaLabelKey: 'filter from - all - aria', key: _all },
        { i18nKey: 'filter from - subscribed', i18nAriaLabelKey: 'filter from - subscribed - aria', key: _subscribed },
        { i18nKey: 'filter from - category', i18nAriaLabelKey: 'filter from - category - aria', key: _category }
      ],
      sort: {
        all: [
          { i18nKey: 'filter sorting - top-past-day', key: _topPastDay },
          { i18nKey: 'filter sorting - top-past-week', key: _topPastWeek },
          { i18nKey: 'filter sorting - top-past-month', key: _topPastMonth },
          { i18nKey: 'filter sorting - top-past-year', key: _topPastYear },
          { i18nKey: 'filter sorting - top-all-time', key: _topAllTime }
        ],
        subscribed: [
          { i18nKey: 'filter sorting - most-recent', key: _mostRecent },
          { i18nKey: 'filter sorting - top-past-day', key: _topPastDay },
          { i18nKey: 'filter sorting - top-past-week', key: _topPastWeek },
          { i18nKey: 'filter sorting - top-past-month', key: _topPastMonth },
          { i18nKey: 'filter sorting - top-past-year', key: _topPastYear },
          { i18nKey: 'filter sorting - top-all-time', key: _topAllTime },
          { i18nKey: 'filter sorting - oldest', key: _oldest }
        ]
      }
    },
    episode: {
      sort: [
        { i18nKey: 'filter sorting - chronological', key: _chronological },
        { i18nKey: 'filter sorting - most-recent', key: _mostRecent },
        { i18nKey: 'filter sorting - top-past-day', key: _topPastDay },
        { i18nKey: 'filter sorting - top-past-week', key: _topPastWeek },
        { i18nKey: 'filter sorting - top-past-month', key: _topPastMonth },
        { i18nKey: 'filter sorting - top-past-year', key: _topPastYear },
        { i18nKey: 'filter sorting - top-all-time', key: _topAllTime },
        { i18nKey: 'filter sorting - oldest', key: _oldest },
        { i18nKey: 'filter sorting - random', key: _random }
      ]
    },
    episodes: {
      from: [
        { i18nKey: 'filter from - all', key: _all },
        { i18nKey: 'filter from - subscribed', key: _subscribed },
        { i18nKey: 'filter from - category', key: _category }
      ],
      sort: {
        all: [
          { i18nKey: 'filter sorting - top-past-day', key: _topPastDay },
          { i18nKey: 'filter sorting - top-past-week', key: _topPastWeek },
          { i18nKey: 'filter sorting - top-past-month', key: _topPastMonth },
          { i18nKey: 'filter sorting - top-past-year', key: _topPastYear },
          { i18nKey: 'filter sorting - top-all-time', key: _topAllTime }
        ],
        subscribed: [
          { i18nKey: 'filter sorting - most-recent', key: _mostRecent },
          { i18nKey: 'filter sorting - top-past-day', key: _topPastDay },
          { i18nKey: 'filter sorting - top-past-week', key: _topPastWeek },
          { i18nKey: 'filter sorting - top-past-month', key: _topPastMonth },
          { i18nKey: 'filter sorting - top-past-year', key: _topPastYear },
          { i18nKey: 'filter sorting - top-all-time', key: _topAllTime }
        ]
      }
    },
    podcast: {
      from: [
        { i18nKey: 'filter from - episodes', key: _episodes },
        { i18nKey: 'filter from - clips', key: _clips }
      ],
      sort: [
        { i18nKey: 'filter sorting - most-recent', key: _mostRecent },
        { i18nKey: 'filter sorting - top-past-day', key: _topPastDay },
        { i18nKey: 'filter sorting - top-past-week', key: _topPastWeek },
        { i18nKey: 'filter sorting - top-past-month', key: _topPastMonth },
        { i18nKey: 'filter sorting - top-past-year', key: _topPastYear },
        { i18nKey: 'filter sorting - top-all-time', key: _topAllTime },
        { i18nKey: 'filter sorting - oldest', key: _oldest },
        { i18nKey: 'filter sorting - random', key: _random }
      ]
    },
    podcasts: {
      from: [
        { i18nKey: 'filter from - all', key: _all },
        { i18nKey: 'filter from - subscribed', key: _subscribed },
        { i18nKey: 'filter from - category', key: _category }
      ],
      sort: {
        all: [
          { i18nKey: 'filter sorting - top-past-day', key: _topPastDay },
          { i18nKey: 'filter sorting - top-past-week', key: _topPastWeek },
          { i18nKey: 'filter sorting - top-past-month', key: _topPastMonth },
          { i18nKey: 'filter sorting - top-past-year', key: _topPastYear },
          { i18nKey: 'filter sorting - top-all-time', key: _topAllTime }
        ],
        subscribed: [
          { i18nKey: 'filter sorting - alphabetical', key: _alphabetical },
          { i18nKey: 'filter sorting - most-recent', key: _mostRecent },
          { i18nKey: 'filter sorting - top-past-day', key: _topPastDay },
          { i18nKey: 'filter sorting - top-past-week', key: _topPastWeek },
          { i18nKey: 'filter sorting - top-past-month', key: _topPastMonth },
          { i18nKey: 'filter sorting - top-past-year', key: _topPastYear },
          { i18nKey: 'filter sorting - top-all-time', key: _topAllTime },
          { i18nKey: 'filter sorting - oldest', key: _oldest }
        ]
      }
    },
    profile: {
      types: [
        { i18nKey: 'filter type - podcasts', key: _podcasts },
        { i18nKey: 'filter type - clips', key: _clips },
        { i18nKey: 'filter type - playlists', key: _playlists }
      ]
    }
  }
}

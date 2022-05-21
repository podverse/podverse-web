import type { Funding, NowPlayingItem, User } from 'podverse-shared'

export type OmniAuralState = {
  globalFilters: {
    videoOnlyMode: boolean
  }
  historyItemsIndex: {
    episodes: Record<
      number,
      {
        /** mediaFileDuration */
        d: number | null
        /** userPlaybackPosition */
        p: number
      }
    >
    mediaRefs: Record<
      number,
      {
        /** mediaFileDuration */
        d: number | null
        /** userPlaybackPosition */
        p: number
        /** complete */
        c: boolean
      }
    >
  }
  makeClip: {
    clipFlagPositions: number[]
    endTime: string
    highlightedPositions: number[]
    isEditing: boolean
    isPublic: boolean
    show: boolean
    startTime: string
    successModalLinkUrl: string
    successModalShow: boolean
    title: string
  }
  modals: {
    addToPlaylist: {
      item: { clipId: number } | { episodeId: number }
    }
    checkout: {
      show: boolean
    }
    confirmDeleteAccount: {
      show: boolean
    }
    featureVideoPreview: {
      videoEmbedData: any
    }
    forgotPassword: {
      show: boolean
      email?: string
    }
    funding: {
      fundingLinks: Funding[]
      show: boolean
    }
    login: {
      show: boolean
      email?: string
      password?: string
    }
    loginToAlert: {
      alertType: string
    }
    resetPassword: {
      show: boolean
    }
    share: {
      items: null | Array<{ label: string; url: string }>
    }
    signUp: {
      show: boolean
    }
    verifyEmail: {
      email: string
      show: boolean
      showSendVerificationEmailButton: boolean
    }
  }
  page: {
    isLoading: boolean
  }
  player: {
    chapterFlagPositions: []
    chapters: []
    clipFlagPositions: []
    clipHasReachedEnd: boolean
    currentNowPlayingItem: null | NowPlayingItem
    duration: number
    highlightedPositions: []
    isAtCurrentLiveStreamTime?: boolean
    isInitialLoad: boolean
    muted: boolean
    paused: boolean
    playbackPosition: number
    playSpeed: number
    show: boolean
    showFullView: boolean
    video: {
      src: string
    }
    volume: number
  }
  session: {
    userInfo: null | User
  }
  userQueueItems: []
  v4vElementInfo: null | { podcastIndexPodcastId: number; episodeMediaUrl: string }
}

export const initialState: OmniAuralState = {
  globalFilters: {
    videoOnlyMode: false
  },
  historyItemsIndex: {
    episodes: {},
    mediaRefs: {}
  },
  makeClip: {
    clipFlagPositions: [],
    endTime: '',
    highlightedPositions: [],
    isEditing: false,
    isPublic: true,
    show: false,
    startTime: '',
    successModalLinkUrl: '',
    successModalShow: false,
    title: ''
  },
  modals: {
    addToPlaylist: {
      item: null
    },
    checkout: {
      show: false
    },
    confirmDeleteAccount: {
      show: false
    },
    featureVideoPreview: {
      videoEmbedData: null
    },
    forgotPassword: {
      show: false
    },
    funding: {
      fundingLinks: [],
      show: false
    },
    login: {
      show: false
    },
    loginToAlert: {
      alertType: ''
    },
    resetPassword: {
      show: false
    },
    share: {
      items: null
    },
    signUp: {
      show: false
    },
    verifyEmail: {
      email: '',
      show: false,
      showSendVerificationEmailButton: false
    }
  },
  page: {
    isLoading: false
  },
  player: {
    chapterFlagPositions: [],
    chapters: [],
    clipFlagPositions: [],
    clipHasReachedEnd: false,
    currentNowPlayingItem: null,
    duration: 0,
    highlightedPositions: [],
    isAtCurrentLiveStreamTime: false,
    isInitialLoad: true,
    muted: false,
    paused: true,
    playbackPosition: 0,
    playSpeed: 1,
    show: false,
    showFullView: false,
    video: {
      src: ''
    },
    volume: 100
  },
  session: {
    userInfo: null
  },
  userQueueItems: [],
  v4vElementInfo: null
}

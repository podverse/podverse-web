export const getPlaybackRateText = num => {
  switch (num) {
    case 0.5:
      return `0.5x`
    case 0.75:
      return `0.75x`
    case 1:
      return `1x`
    case 1.25:
      return `1.25x`
    case 1.5:
      return `1.5x`
    case 2:
      return `2x`
    default:
      return `1x`
  }
}

export const getPlaybackRateNextValue = num => {
  switch (num) {
    case 0.5:
      return 0.75
    case 0.75:
      return 1
    case 1:
      return 1.25
    case 1.25:
      return 1.5
    case 1.5:
      return 2
    case 2:
      return 0.5
    default:
      return 1
  }
}

export const constants = {
  core: {
    About: `About`,
    Clips: `Clips`,
    Contact: `Contact`,
    Episodes: `Episodes`,
    FAQ: `FAQ`,
    FromThisEpisode: `From this episode`,
    FromThisPodcast: `From this podcast`,
    Login:  `Login`,
    Logout: `Log out`,
    MyClips: `My Clips`,
    MyPlaylists: `My Playlists`,
    MyPodcasts: `My Podcasts`,
    MyProfile: `My Profile`,
    Playlists: `Playlists`,
    Podcasts: `Podcasts`,
    Premium: `Premium`,
    PremiumFreeTrial: `Premium (Free Trial)`,
    Profiles: `Profiles`,
    Settings: `Settings`,
    Terms: `Terms`,
    TurnOnDark: `Turn on dark mode`,
    TurnOnLight: `Turn on light mode`
  },
  attributes: {
    dark: `dark`,
    // TODO: the linter is throwing errors because these key names
    // are not using camel case, but this is actually a situation where
    // underscore ("snake case") makes sense. Highlight the red error,
    // select the "Quick fix" option, then select the option to
    // disable the camel case rule for this whole file.
    data_theme: `data-theme`,
    is_switching_ui_mode: `is-switching-ui-mode`,
    light: `light`,
    nsfwMode: `nsfwMode`,
    verify_email: `verify-email`,
  },
  colors:{
    danger: `danger`,
    warning: `warning`
  },
  cookies: {
    handleSendVerificationEmailSubmit: `handleSendVerificationEmailSubmit`,
    showEmailVerificationNeeded: `showEmailVerificationNeeded`,
    showFreeTrialHasEnded: `showFreeTrialHasEnded`,
    showFreeTrialWarning: `showFreeTrialWarning`,
    showMembershipHasEnded: `showMembershipHasEnded`,
    showMembershipWarning: `showMembershipWarning`,
    uiTheme: `uiTheme`,
  },
  errors: {
    alerts: {
      couldNotUpdateQueue: `Could not update queue on server. Please check your internet connection.`,
      deleteClipFailed: `Delete clip failed. Please check your internet connection and try again later.`,
      premiumRequired: `Your Premium membership has expired. Renew your membership on the Settings page, or log out to create a clip anonymously.`,
      somethingWentWrong: `Something went wrong. Please check your internet connection.`,
      noProfilesFound: `No profiles found`
    },
    login: {
      SubscribeToPodcast: `Login to subscribe to this podcast.`,
      SubscribeToProfile: `Login to subscribe to this profile.`,
      ViewYourSubscriptions: `Login to view your subscriptions`,
      ViewYourProfiles: `Login to view your profiles`
    },
    premiumRequired: `Premium Membership Required`,
    getAutoplayValue: `getAutoplayValue`,
    getPlaybackRateValue: `getPlaybackRateValue`,
    
  },
  mediaList: {
    noResultMsg: {
      noClipsFound: `No clips found`,
      noPlaylistsFound: `No playlists found`,
      noPodcastsFound: `No podcasts found`,
      noSubscribedPodcastsFound: `No subscribed podcasts found`,
    },
    now_playing_clip_from_episode: `now-playing-item-clip-from-episode`,
    now_playing_clip_from_podcast: `now-playing-item-clip-from-podcast`,
    now_playing_episode_from_all_podcasts: `now-playing-item-episode-from-all-podcasts`,
    now_playing_episode_from_podcast: `now-playing-item-episode-from-podcast`,
    now_playing_item: `now-playing-item`,
    playlist: `playlist`,
    podcast: `podcast`
  },
  paths: {
    about: `/about`,
    clip: `/clip`,
    clips: `/clips`,
    episode: `/episode`,
    episodes: `/episodes`,
    faq: `/faq`,
    googlePlayStoreBadge: `https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png`,
    home: `/`,
    license: `https://www.gnu.org/licenses/agpl-3.0.en.html`,
    membership: `/membership`,
    my_profile_clips: `/my-profile?type=clips`,
    my_profile: `/my-profile`,
    playlists: `/playlists`,
    podcasts: `/podcasts`,
    profiles: `/profiles`,
    search: `/search`,
    settings_membership: `/settings#membership`,
    settings: `/settings`,
    support_podverse_fm: `mailto:support@podverse.fm`,
    terms: `/terms`,
    unspam: `http://www.unspam.com/noemailcollection/`
  },
  query: {
    label:{
      All: `All`,
      AllPodcasts: `All Podcasts`,
      alphabetical: `alphabetical`,
      Categories: `Categories`,
      most_recent: `most recent`,
      random: `random`,
      Subscribed: `Subscribed`,
      top_all_time: `top - all time`,
      top_past_day: `top - past day`,
      top_past_month: `top - past month`,
      top_past_week: `top - past week`,
      top_past_year: `top - past year`
    },
    alphabetical: `alphabetical`,
    all_podcasts: `all-podcasts`,
    chronological: `chronological`,
    clips: `clips`,
    episodes: `episodes`,
    from_category: `from-category`,
    from_episode: `from-episode`,
    from_podcast: `from-podcast`,
    most_recent: `most-recent`,
    no_results: `no-results`,
    oldest: `oldest`,
    podcasts: `podcasts`,
    playlists: `playlists`,
    random: `random`,
    subscribed_only: `subscribed-only`,
    top_all_time: `top-all-time`,
    top_past_day: `top-past-day`,
    top_past_month: `top-past-month`,
    top_past_week: `top-past-week`,
    top_past_year: `top-past-year`
  },
  src : {
    components: {
      Alerts: {
        EmailSent: `Email Sent! Please check your inbox.`,
        ForHelp: ` for help.`,
        PleaseCheckInbox: `If it does not appear in the next 5 minutes, please check your inbox's Spam or Promotions folders.`,
        PleaseEmail: `If it still doesn't appear, please email `,
        SupportEmail: `support@podverse.fm`,
        // TODO: replace strings with dynamic values with a constants function
        // like YourFreeTrialHasEnded below. See Alerts.tsx for an example.
        // Note how a string is passed in as a parameter to the function and called a "renewLink".
        YourFreeTrialHasEnded: (renewLink) => `Your free trial has ended. ${renewLink} to continue using premium features.`
      },
      AppLinkWidget: {
        GetItOnGooglePlay: `Get it on Google Play`,
        IHaveTheApp: `I have the app`,
        OpenInTheApp: `Open in the app`
      },
      CheckoutModal: {
        CheckoutLabel: `Checkout`
      },
      DeleteAccountModal: {
        Cancel: `Cancel`,
        Delete: `Delete`,
        DeleteAccountLabel: `Delete Account`,
      },
      NSFWModal: {
        ContentMayBeNSFW: `content may not be safe for your work!`,
        NSFWConfirmPopupLabel: `NSFW Confirm Popup`,
        NSFWModeOn: `NSFW mode on`,
        RatingsProvidedByPodcasters: `Ratings are provided by the podcasters themselves,`,
        RefreshToHideNSFW: `Refresh your browser to hide NSFW content`,
        RefreshToIncludeNSFW: `Refresh your browser to include NSFW content`,
        SFWModeOn: `SFW mode on`
      },
      UserHeaderCtrl: {
        CopyLinkToProfile: `Copy Link to your Profile`,
      },
      UserListCtrl: {
        MakeProfilePublic: ` to make your profile public`,
        SettingsPage: `Settings page`,
        VisitThe: `Visit the `
      }
    },
  }
}

// TODO: move these into the constants object, update files where they are used
// player
export const kAutoplay = `mediaPlayerAutoplay`
export const kPlaybackRate = `mediaPlayerPlaybackRate`
// error message
export const internetConnectivityErrorMessage = `Error: Please check your internet connection and try again later.`

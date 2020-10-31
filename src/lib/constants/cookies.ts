import config from '~/config'
const { cookieConfig } = config()
const { keyNamespace } = cookieConfig

export const cookies = {
  censorNSFWText: `${keyNamespace}_censorNSFWText`,
  defaultHomepageTab: `${keyNamespace}_defaultHomepageTab`,
  handleSendVerificationEmailSubmit: `${keyNamespace}_handleSendVerificationEmailSubmit`,
  playbackSpeedButtonHide: `${keyNamespace}_playbackSpeedButtonHide`,
  query: {
    clip: `${keyNamespace}_clip_query`,
    clips: `${keyNamespace}_clips_query`,
    episode: `${keyNamespace}_episode_query`,
    episodes: `${keyNamespace}_episodes_query`,
    podcast: `${keyNamespace}_podcast_query`,
    podcasts: `${keyNamespace}_podcasts_query`
  },
  showEmailVerificationNeeded: `${keyNamespace}_showEmailVerificationNeeded`,
  showFreeTrialHasEnded: `${keyNamespace}_showFreeTrialHasEnded`,
  showFreeTrialWarning: `${keyNamespace}_showFreeTrialWarning`,
  showMembershipHasEnded: `${keyNamespace}_showMembershipHasEnded`,
  showMembershipWarning: `${keyNamespace}_showMembershipWarning`,
  timeJumpBackwardButtonHide: `${keyNamespace}_timeJumpBackwardButtonHide`,
  uiTheme: `${keyNamespace}_uiTheme`
}

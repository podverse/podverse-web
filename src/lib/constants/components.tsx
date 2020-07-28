import React from 'react'
import { paths } from './paths'
import Link from 'next/link'

export const components = {
  Alerts: {
    ContactSupport: () => (<span>If it still doesn't appear, please email <a href={paths.web.support_podverse_fm}>{components.Alerts.SupportEmail}</a> for help.</span>),
    EmailSending: `Email sending... `,
    EmailSent: `Email Sent! Please check your inbox.`,
    PleaseCheckInbox: `If it does not appear in the next 5 minutes, please check your inbox's Spam or Promotions folders.`,
    Renew: `Renew`,
    SupportEmail: `support@podverse.fm`,
    YourFreeTrialHasEnded: (renewLink) => `Your free trial has ended. ${renewLink} to continue using premium features.`,
    YourFreeTrialWillEndSoon: (renewLink) => `Your free trial will end soon. ${renewLink} to continue using premium features.`,
    YourMembershipHasExpired: (renewLink) => `Your membership has expired. ${renewLink} to continue using premium features.`,
    YourMembershipWillExpireSoon: (renewLink) => `Your membership will expire soon. ${renewLink} to continue using premium features.`
  },
  AppLinkWidget: {
    GetItOnGooglePlay: `Get it on Google Play`,
    IHaveTheApp: `I have the app`,
    OpenInTheApp: `Open in the app`
  },
  Auth: {
    TryPremium1Year: () =>  (<p style={{ textAlign: 'center' }}>Try premium free for 1 year!<br />$10 per year after that</p>)
  },
  DeleteAccountModal: {
    DeleteAccountLabel: `Delete Account`,
  },
  MediaHeaderCtrl: {
    PremiumMembershipRequired: `Premium Membership Required`
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
    MakeProfilePublic: (instance) => (<p>Visit the <Link as={paths.web.settings} href={paths.web.settings}><a onClick={instance.linkClick}>Settings page</a></Link> to make your profile public</p>)
  }
}
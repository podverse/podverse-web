export const components = {
  Alerts: {
    // like YourFreeTrialHasEnded below. See Alerts.tsx for an example.
    // Note how a string is passed in as a parameter to the function and called a "renewLink".
    // TODO: replace strings with dynamic values with a constants function
    EmailSending: `Email sending... `,
    EmailSent: `Email Sent! Please check your inbox.`,
    ForHelp: ` for help.`,
    PleaseCheckInbox: `If it does not appear in the next 5 minutes, please check your inbox's Spam or Promotions folders.`,
    PleaseEmail: `If it still doesn't appear, please email `,
    PleaseVerifyEmail: `Please verify your email address to login.`,
    Renew: `Renew`,
    SendVerificationEmail: `send verification email`,
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
}
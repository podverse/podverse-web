import React from 'react'
import { paths } from '../paths'
import Link from 'next/link'

export const common = {
  LoginToViewYour: (itemType) => `Login to view your ${itemType}`,
  MakeProfilePublic: (instance) => (<p>Visit the <Link as={ paths.web.settings } href = { paths.web.settings } > <a onClick={ instance.linkClick }> Settings page </a></Link> to make your profile public </p>),
  noResultsMessage: (itemType, extraText?) => `No ${itemType}${extraText ? ` ${extraText} ` : ''} found.`,
  TryPremium1Year: () => (<p style = {{ textAlign: 'center' }}> Try premium free for 1 year! < br /> $10 per year after that </p>),
  YourFreeTrialHasEnded: (renewLink) => `Your free trial has ended. ${renewLink} to continue using premium features.`,
  YourFreeTrialWillEndSoon: (renewLink) => `Your free trial will end soon. ${renewLink} to continue using premium features.`,
  YourMembershipHasExpired: (renewLink) => `Your membership has expired. ${renewLink} to continue using premium features.`,
  YourMembershipWillExpireSoon: (renewLink) => `Your membership will expire soon. ${renewLink} to continue using premium features.`
}

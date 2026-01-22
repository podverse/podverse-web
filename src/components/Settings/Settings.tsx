"use client"

import React from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams, useRouter } from 'next/navigation'
import { ListHeader } from '../List/ListHeader'
import { SettingsWrapper } from './SettingsWrapper'
import { SettingsAccount } from './Panels/SettingsAccount/SettingsAccount'
import { SettingsGeneral } from './Panels/SettingsGeneral/SettingsGeneral'
import { SettingsNotifications } from './Panels/SettingsNotifications/SettingsNotifications'
import { SettingsProfile } from './Panels/SettingsProfile/SettingsProfile'
import { Tabs } from '../Tabs/Tabs'
import { useAccount } from '../../contexts/Account'

export function Settings() {
  const tSettings = useTranslations('settings')
  const tContact = useTranslations('contact')
  const searchParams = useSearchParams()
  const router = useRouter()
  const { loggedInAccount } = useAccount()
  
  // Check for tab query param on mount
  const tabFromQuery = searchParams.get('tab')
  // For non-logged-in users, default to 'general' even if query param specifies a restricted tab
  const initialTab = loggedInAccount
    ? (tabFromQuery === 'profile' ? 'profile' : 
       tabFromQuery === 'account' ? 'account' :
       tabFromQuery === 'notifications' ? 'notifications' : 'general') as 'account'|'general'|'notifications'|'profile'
    : 'general'
  
  const [tab, setTab] = React.useState<'account'|'general'|'notifications'|'profile'>(initialTab)

  // Redirect non-logged-in users to 'general' tab if they try to access restricted tabs
  React.useEffect(() => {
    if (!loggedInAccount && tab !== 'general') {
      setTab('general')
      // Update URL to remove tab param
      const params = new URLSearchParams(searchParams.toString())
      params.delete('tab')
      router.replace(`/settings${params.toString() ? `?${params.toString()}` : ''}`)
    }
  }, [loggedInAccount, tab, searchParams, router])

  const handleTabChange = (newTab: 'account'|'general'|'notifications'|'profile') => {
    setTab(newTab)
    // Remove tab query param when user clicks a tab
    const params = new URLSearchParams(searchParams.toString())
    params.delete('tab')
    router.replace(`/settings${params.toString() ? `?${params.toString()}` : ''}`)
  }

  // Filter tabs based on login status
  const allTabs = [
    {
      key: 'general',
      label: tContact('general'),
      onClick: () => handleTabChange('general'),
      zIndex: 10
    },
    {
      key: 'account',
      label: tSettings('account.account'),
      onClick: () => handleTabChange('account'),
      zIndex: 9
    },
    {
      key: 'profile',
      label: tSettings('profile.profile'),
      onClick: () => handleTabChange('profile'),
      zIndex: 8
    },
    {
      key: 'notifications',
      label: tSettings('notifications.notifications'),
      onClick: () => handleTabChange('notifications'),
      zIndex: 7
    }
  ]

  const tabData = loggedInAccount ? allTabs : [allTabs[0]] // Only show General tab for non-logged-in users

  return (
    <div>
      <ListHeader
        tabs={
          <Tabs
            tabData={tabData}
            selectedKey={tab}
          />
        }
      />
      <SettingsWrapper>
        {tab === 'general' && <SettingsGeneral />}
        {loggedInAccount && tab === 'account' && <SettingsAccount />}
        {loggedInAccount && tab === 'profile' && <SettingsProfile />}
        {loggedInAccount && tab === 'notifications' && <SettingsNotifications />}
      </SettingsWrapper>
    </div>
  )
}

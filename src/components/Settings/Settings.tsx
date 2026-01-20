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

export function Settings() {
  const tSettings = useTranslations('settings')
  const tContact = useTranslations('contact')
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Check for tab query param on mount
  const tabFromQuery = searchParams.get('tab')
  const initialTab = (tabFromQuery === 'profile' ? 'profile' : 
                      tabFromQuery === 'account' ? 'account' :
                      tabFromQuery === 'notifications' ? 'notifications' : 'general') as 'account'|'general'|'notifications'|'profile'
  
  const [tab, setTab] = React.useState<'account'|'general'|'notifications'|'profile'>(initialTab)

  const handleTabChange = (newTab: 'account'|'general'|'notifications'|'profile') => {
    setTab(newTab)
    // Remove tab query param when user clicks a tab
    const params = new URLSearchParams(searchParams.toString())
    params.delete('tab')
    router.replace(`/settings${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const tabData = [
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
        {tab === 'account' && <SettingsAccount />}
        {tab === 'profile' && <SettingsProfile />}
        {tab === 'notifications' && <SettingsNotifications />}
      </SettingsWrapper>
    </div>
  )
}

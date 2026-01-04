"use client"

import React from 'react'
import { useTranslations } from 'next-intl'
import { ListHeader } from '../List/ListHeader'
import { SettingsWrapper } from './SettingsWrapper'
import { SettingsNotifications } from './Panels/SettingsNotifications'
import { SettingsAccount } from './Panels/SettingsAccount'
import { Tabs } from '../Tabs/Tabs'

export function Settings() {
  const tSettings = useTranslations('settings')
  const [tab, setTab] = React.useState<'account'|'notifications'>('account')

  const tabData = [
    {
      key: 'account',
      label: tSettings('account.account'),
      onClick: () => setTab('account'),
      zIndex: 10
    },
    {
      key: 'notifications',
      label: tSettings('notifications.notifications'),
      onClick: () => setTab('notifications'),
      zIndex: 9
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
        {tab === 'account' && <SettingsAccount />}
        {tab === 'notifications' && <SettingsNotifications />}
      </SettingsWrapper>
    </div>
  )
}

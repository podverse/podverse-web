"use client"

import React from 'react'
import { useTranslations } from 'next-intl'
import { ListHeader } from '../List/ListHeader'
import { SettingsWrapper } from './SettingsWrapper'
import { SettingsAccount } from './Panels/SettingsAccount/SettingsAccount'
import { SettingsGeneral } from './Panels/SettingsGeneral/SettingsGeneral'
import { SettingsNotifications } from './Panels/SettingsNotifications/SettingsNotifications'
import { Tabs } from '../Tabs/Tabs'

export function Settings() {
  const tSettings = useTranslations('settings')
  const tContact = useTranslations('contact')
  const [tab, setTab] = React.useState<'account'|'general'|'notifications'>('general')

  const tabData = [
    {
      key: 'general',
      label: tContact('general'),
      onClick: () => setTab('general'),
      zIndex: 10
    },
    {
      key: 'account',
      label: tSettings('account.account'),
      onClick: () => setTab('account'),
      zIndex: 9
    },
    {
      key: 'notifications',
      label: tSettings('notifications.notifications'),
      onClick: () => setTab('notifications'),
      zIndex: 8
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
        {tab === 'notifications' && <SettingsNotifications />}
      </SettingsWrapper>
    </div>
  )
}

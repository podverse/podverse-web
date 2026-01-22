"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { DATABASE_CONSTANTS, SharableStatusEnum } from 'podverse-helpers'
import { useAccount } from '../../../../contexts/Account'
import { Button } from '../../../Button/Button'
import { SettingsSection } from '../../SettingsSection'
import { TextInput } from '../../../Form/TextInput'
import { TextArea } from '../../../Form/TextArea'
import { FormDropdown } from '../../../Form/FormDropdown'
import { SHARABLE_STATUS } from '../../../../constants/sharableStatus'
import { apiRequestService } from '../../../../factories/apiRequestService'
import { showToast } from '../../../Toast/Toast'

export function SettingsProfile() {
  const tSettings = useTranslations('settings')
  const tMisc = useTranslations('misc')
  const { loggedInAccount, setLoggedInAccount } = useAccount()
  const locale = useLocale()
  const [isSaving, setIsSaving] = useState(false)

  const [displayName, setDisplayName] = useState(
    loggedInAccount?.account_profile?.display_name || ''
  )
  const [bio, setBio] = useState(
    loggedInAccount?.account_profile?.bio || ''
  )
  const [sharableStatus, setSharableStatus] = useState<string>(
    `${loggedInAccount?.sharable_status_id || SharableStatusEnum.Private}`
  )

  // Update sharableStatus state when loggedInAccount changes
  useEffect(() => {
    if (loggedInAccount?.sharable_status_id !== undefined) {
      setSharableStatus(`${loggedInAccount.sharable_status_id}`)
    }
  }, [loggedInAccount?.sharable_status_id])

  const sharableStatusMenuItems = SHARABLE_STATUS.menuItems(tMisc)

  const sharableStatusInfo = useMemo(() => {
    if (sharableStatus === `${SharableStatusEnum.Public}`) {
      return tSettings('profile.sharable_status_public_description')
    } else if (sharableStatus === `${SharableStatusEnum.Unlisted}`) {
      return tSettings('profile.sharable_status_unlisted_description')
    } else {
      return tSettings('profile.sharable_status_private_description')
    }
  }, [sharableStatus, tSettings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loggedInAccount) return

    setIsSaving(true)

    try {
      const updatedAccount = await apiRequestService.reqAccountUpdate({
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        sharable_status: Number(sharableStatus),
        locale: loggedInAccount.account_settings?.account_settings_locale?.locale || locale
      })
      
      setLoggedInAccount(updatedAccount)
      showToast(tSettings('profile.update_success'), 'success')
    } catch (error) {
      showToast(tMisc('errors.generic'), 'error')
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <SettingsSection>
        <h3>{tSettings('profile.sharable_status')}</h3>
        <FormDropdown
          id="sharable_status"
          menuItems={sharableStatusMenuItems}
          value={sharableStatus}
          onChange={(value) => setSharableStatus(value)}
          info={sharableStatusInfo}
        />
      </SettingsSection>
      <SettingsSection>
        <h3>{tSettings('profile.display_name')}</h3>
        <TextInput
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder={tMisc('anonymous')}
          info={tSettings('profile.display_name_description')}
        />
      </SettingsSection>
      <SettingsSection>
        <h3>{tSettings('profile.bio')}</h3>
        <TextArea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder={tSettings('profile.bio_placeholder')}
          rows={5}
          maxLength={DATABASE_CONSTANTS.varchar_long}
          info={tSettings('profile.bio_description')}
        />
      </SettingsSection>
      <SettingsSection>
        <Button
          type="submit"
          variant="primary"
          disabled={isSaving}
        >
          {isSaving ? tMisc('saving') : tMisc('save')}
        </Button>
      </SettingsSection>
    </form>
  )
}

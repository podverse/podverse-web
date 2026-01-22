"use client"

import React, { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useAccount } from '../../../../contexts/Account'
import { Button } from '../../../Button/Button'
import { ModalDeleteAccount } from './ModalDeleteAccount'
import { ModalChangeEmail } from './ModalChangeEmail'
import { SettingsSection } from '../../SettingsSection'
import { Divider } from '../../../Divider/Divider'
import { apiRequestService } from '../../../../factories/apiRequestService'
import { showToast, showToastLoading, dismissToast } from '../../../Toast/Toast'
import { handleRateLimitAlert } from '../../../../utils/rateLimit/rateLimitAlert'

export function SettingsAccount() {
  const tSettings = useTranslations('settings')
  const tMisc = useTranslations('misc')
  const locale = useLocale()
  const { loggedInAccount } = useAccount()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const userEmail = loggedInAccount?.account_credentials?.email || ''

  const handleDownloadData = async () => {
    setIsDownloading(true)
    
    // Show loading toast
    const loadingToastId = showToastLoading(tSettings('account.download_my_data_loading'))
    
    try {
      const blob: Blob = await apiRequestService.reqAccountDownloadData()
      
      // Download zip file
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `podverse-data-export-${new Date().toISOString().split('T')[0]}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      // Dismiss loading toast and show success
      dismissToast(loadingToastId)
      showToast(tSettings('account.download_my_data_success'), 'success')
    } catch (error) {
      console.error('[SettingsAccount.downloadData] Error:', error)
      // Dismiss loading toast
      dismissToast(loadingToastId)
      
      const rateLimitErrorHandled = await handleRateLimitAlert(error, locale, tMisc)
      if (!rateLimitErrorHandled) {
        // Rate limit not handled, show error toast
        showToast(tSettings('account.download_my_data_error'), 'error')
      }
      // If rate limit was handled, handleRateLimitAlert already showed an alert
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <>
      <SettingsSection>
        <h3>{tSettings('account.change_email')}</h3>
        <Button
          type="button"
          onClick={() => setIsChangeEmailModalOpen(true)}
          variant="primary"
          description={tSettings('account.change_email_description')}
        >
          {tSettings('account.change_email')}
        </Button>
        <ModalChangeEmail
          isOpen={isChangeEmailModalOpen}
          onClose={() => setIsChangeEmailModalOpen(false)}
        />
      </SettingsSection>
      <Divider withSpacing />
      <SettingsSection>
        <h3>{tSettings('account.download_my_data')}</h3>
        <Button
          type="button"
          onClick={handleDownloadData}
          variant="primary"
          description={tSettings('account.download_my_data_description')}
          isLoading={isDownloading}
          disabled={isDownloading}
        >
          {tSettings('account.download_my_data')}
        </Button>
      </SettingsSection>
      <Divider withSpacing />
      <SettingsSection>
        <h3>{tSettings('account.delete_account')}</h3>
        <Button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          variant="danger"
          description={tSettings('account.delete_account_description')}
        >
          {tSettings('account.delete_account')}
        </Button>
        <ModalDeleteAccount
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          userEmail={userEmail}
        />
      </SettingsSection>
    </>
  )
}

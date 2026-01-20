"use client"

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAccount } from '../../../../contexts/Account'
import { Button } from '../../../Button/Button'
import { ModalDeleteAccount } from './ModalDeleteAccount'
import { ModalChangeEmail } from './ModalChangeEmail'
import { SettingsSection } from '../../SettingsSection'
import { Divider } from '../../../Divider/Divider'

export function SettingsAccount() {
  const tSettings = useTranslations('settings')
  const { loggedInAccount } = useAccount()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false)

  const userEmail = loggedInAccount?.account_credentials?.email || ''

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

"use client"

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAccount } from '../../../../contexts/Account'
import { Button } from '../../../Button/Button'
import { ModalDeleteAccount } from './ModalDeleteAccount'

export function SettingsAccount() {
  const tSettings = useTranslations('settings')
  const { loggedInAccount } = useAccount()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const userEmail = loggedInAccount?.account_credentials?.email || ''

  return (
    <>
      <h3>{tSettings('account.delete_account')}</h3>
      <Button
        type="button"
        onClick={() => setIsDeleteModalOpen(true)}
        variant="danger"
        description={tSettings('account.delete_account_description')}
        style={{ width: 'fit-content', paddingLeft: '20px', paddingRight: '20px' }}
      >
        {tSettings('account.delete_account')}
      </Button>
      <ModalDeleteAccount
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        userEmail={userEmail}
      />
    </>
  )
}

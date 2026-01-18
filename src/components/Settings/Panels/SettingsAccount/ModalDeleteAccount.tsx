"use client"

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { Modal } from '../../../Modal/Modal'
import { TextInput } from '../../../Form/TextInput'
import { Button } from '../../../Button/Button'
import styles from '../../../../styles/components/Modal/ModalDeleteAccount.module.scss'
import { apiRequestService } from '../../../../factories/apiRequestService'
import { useAccount } from '../../../../contexts/Account'
import { handleRateLimitAlert } from '../../../../utils/rateLimit/rateLimitAlert'

type ModalDeleteAccountProps = {
  isOpen: boolean
  onClose: () => void
  userEmail: string
}

export const ModalDeleteAccount: React.FC<ModalDeleteAccountProps> = ({
  isOpen,
  onClose,
  userEmail
}) => {
  const tSettings = useTranslations('settings')
  const tAuthentication = useTranslations('authentication')
  const tMisc = useTranslations('misc')
  const locale = useLocale()
  const { setLoggedInAccount } = useAccount()
  const [emailInput, setEmailInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [hasBlurred, setHasBlurred] = useState(false)

  const emailMatches = emailInput.toLowerCase().trim() === userEmail.toLowerCase().trim()
  
  // Determine error message to display (API error takes precedence)
  // Email mismatch error only shows after blur
  // Don't show any errors while submitting
  const getErrorMessage = (): string | undefined => {
    if (isSubmitting) {
      return undefined
    }
    if (showErrorMessage && errorMessage) {
      return errorMessage
    }
    if (!emailMatches && emailInput.length > 0 && hasBlurred) {
      return tSettings('account.delete_account_modal.email_mismatch')
    }
    return undefined
  }

  const errorMessageToShow = getErrorMessage()

  const handleDelete = async () => {
    if (!emailMatches) {
      return
    }

    // Clear all error states before attempting deletion
    setIsSubmitting(true)
    setShowErrorMessage(false)
    setErrorMessage('')
    setHasBlurred(false)

    try {
      await apiRequestService.reqAccountDelete()
      // Clear account context
      setLoggedInAccount(null)
      // Logout to clear server session
      try {
        await apiRequestService.reqAuthLogout()
      } catch {
        // Logout may fail if session is already invalid, that's ok
      }
      // Reload to clear client state and show logged-out UI
      window.location.href = '/'
    } catch (err: any) {
      const rateLimitErrorHandled = handleRateLimitAlert(err, locale, tMisc)
      if (!rateLimitErrorHandled) {
        setErrorMessage(err?.response?.data?.message || tMisc('errors.generic'))
        setShowErrorMessage(true)
      }
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setEmailInput('')
    setShowErrorMessage(false)
    setErrorMessage('')
    setHasBlurred(false)
    setIsSubmitting(false)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      header={tSettings('account.delete_account_modal.title')}
      ariaLabel={tSettings('account.delete_account_modal.title')}
      modalContentMaxWidth={500}
    >
      <div className={styles.content}>
        <p className={styles.message}>
          {tSettings('account.delete_account_modal.message')}
        </p>
        <TextInput
          type="email"
          name="email"
          value={emailInput}
          onChange={e => setEmailInput(e.target.value)}
          onBlur={() => setHasBlurred(true)}
          placeholder={tAuthentication('email')}
          eyebrow={tAuthentication('email')}
          infoError={errorMessageToShow}
          aria-invalid={!!errorMessageToShow}
          autoFocus
        />
        <div className={styles.buttons}>
          <Button
            type="button"
            onClick={handleClose}
            variant="secondary"
            disabled={isSubmitting}
          >
            {tMisc('cancel')}
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            variant="primary"
            disabled={!emailMatches || isSubmitting}
          >
            {tSettings('account.delete_account')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

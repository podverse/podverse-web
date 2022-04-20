import OmniAural, { useOmniAural } from 'omniaural'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from 'react-modal'
import { ButtonClose, ButtonRectangle } from '~/components'
import { sendVerification } from '~/services/auth'
import { OmniAuralState } from '~/state/omniauralState'

type Props = unknown

export const VerifyEmailModal = (props: Props) => {
  const [verifyEmail] = useOmniAural('modals.verifyEmail') as [OmniAuralState['modals']['verifyEmail']]
  const { show, showSendVerificationEmailButton } = verifyEmail
  const { t } = useTranslation()
  const [isVerifyPressed, setIsVerifyPressed] = useState<boolean>(false)
  const autoFocusElement = useRef<any>()

  /* Event Handlers */

  const _handleSendVerificationEmail = async () => {
    try {
      setIsVerifyPressed(true)
      const email = OmniAural.state.modals.verifyEmail.email.value()
      const response = await sendVerification(email)
      const successMessage = response?.data?.message
      alert(successMessage)
      return
    } catch (error) {
      setIsVerifyPressed(false)
      if (error.response?.data?.message) {
        alert(error.response.data.message)
        return
      }
    } finally {
      setIsVerifyPressed(false)
    }
    alert(t('internetConnectivityErrorMessage'))
  }

  const _onRequestClose = () => {
    OmniAural.modalsHideAll()
  }

  const _onAfterOpen = () => {
    autoFocusElement?.current?.focus()
  }

  return (
    <Modal
      className='verify-email-modal centered'
      contentLabel={t('Verify email modal')}
      isOpen={show}
      onAfterOpen={_onAfterOpen}
      onRequestClose={_onRequestClose}
    >
      <ButtonClose onClick={_onRequestClose} />
      <div className='message-wrapper'>
        <div className='message with-margin' ref={autoFocusElement} tabIndex={0}>
          {t('PleaseVerifyEmail')}
        </div>
        {showSendVerificationEmailButton && (
          <ButtonRectangle
            isLoading={isVerifyPressed}
            label={t('Send Verification Email')}
            onClick={_handleSendVerificationEmail}
            type='primary'
          />
        )}
      </div>
      <div className='submit-buttons'>
        <ButtonRectangle label={t('Close')} onClick={_onRequestClose} type='secondary' />
      </div>
    </Modal>
  )
}

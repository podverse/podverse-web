import OmniAural, { useOmniAural } from 'omniaural'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from 'react-modal'
import { ButtonClose, ButtonRectangle, TextInput } from '~/components'
import { logOut } from '~/services/auth'
import { deleteAccount } from '~/services/user'
import { OmniAuralState } from '~/state/omniauralState'

type Props = unknown

export const ConfirmDeleteAccountModal = (props: Props) => {
  const [confirmDeleteAccount] = useOmniAural('modals.confirmDeleteAccount') as [
    OmniAuralState['modals']['confirmDeleteAccount']
  ]
  const { t } = useTranslation()
  const [isDeleteAccountPressed, setIsDeleteAccountPressed] = useState<boolean>(false)
  const [confirmText, setConfirmText] = useState<string>('')

  /* Event Handlers */

  const _handleDeleteAccount = async () => {
    if (confirmText === 'delete') {
      try {
        setIsDeleteAccountPressed(true)
        await deleteAccount()
        await logOut()
        window.location.href = '/'
      } catch (error) {
        setIsDeleteAccountPressed(false)
        if (error.response?.data?.message) {
          alert(error.response.data.message)
        } else {
          alert(t('internetConnectivityErrorMessage'))
        }
      }
    }
  }

  const _onRequestClose = () => {
    OmniAural.modalsHideAll()
  }

  return (
    <Modal
      className='confirm-delete-account-modal centered'
      contentLabel={t('Confirm Delete Account modal')}
      isOpen={confirmDeleteAccount.show}
      onRequestClose={_onRequestClose}
    >
      <h2 tabIndex={0}>{t('Delete Account')}</h2>
      <ButtonClose onClick={_onRequestClose} />
      <div className='header-wrapper' tabIndex={0}>
        <p>{t('ConfirmDeleteModalLine1')}</p>
        <p>{t('ConfirmDeleteModalLine2')}</p>
      </div>
      <TextInput
        label={t('Confirm Delete')}
        onChange={(value) => {
          setConfirmText(value)
        }}
        placeholder={t('Type delete')}
        type='text'
        value={confirmText}
      />
      <div className='buttons-wrapper'>
        <ButtonRectangle label={t('Cancel')} onClick={_onRequestClose} type='secondary' />
        <ButtonRectangle
          disabled={confirmText !== t('delete')}
          isDanger
          isLoading={isDeleteAccountPressed}
          label={t('Delete Account')}
          onClick={_handleDeleteAccount}
          type='primary'
        />
      </div>
    </Modal>
  )
}

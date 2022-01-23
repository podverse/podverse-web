import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import Modal from 'react-modal'
import { ButtonClose, TextInputCopy } from '~/components'

type Props = unknown

export const ShareModal = (props: Props) => {
  const [items] = useOmniAural('modals.share.items')
  const { t } = useTranslation()
  const isOpen = !!items?.length

  /* Function Helpers */

  const _onRequestClose = () => {
    OmniAural.modalsHideAll()
  }

  /* Render Helpers */

  const generateCopyTextInputs = () => {
    if (items && Array.isArray(items)) {
      return items.map((x: any, index: number) => (
        <TextInputCopy key={`${x.url}-${index}`} label={x.label} value={x.url} />
      ))
    }
    return null
  }

  return (
    <Modal className='share-modal centered' isOpen={isOpen} onRequestClose={_onRequestClose}>
      <h2>{t('Share')}</h2>
      <ButtonClose onClick={_onRequestClose} />
      {generateCopyTextInputs()}
    </Modal>
  )
}

import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import Modal from 'react-modal'
import { ButtonClose, FundingLink } from '~/components'

type Props = unknown

export const FundingModal = (props: Props) => {
  const [funding] = useOmniAural('modals.funding')
  const { t } = useTranslation()
  const { fundingLinks, show } = funding

  /* Function Helpers */

  const _onRequestClose = () => {
    OmniAural.modalsHideAll()
  }

  /* Render Helpers */

  const generateFundingLinks = () => {
    if (Array.isArray(fundingLinks)) {
      return fundingLinks.map((x: any) => <FundingLink key={x.url} link={x.url} value={x.value} />)
    }
    return null
  }

  return (
    <Modal className='funding-modal centered' isOpen={show} onRequestClose={_onRequestClose}>
      <h2>{t('Funding')}</h2>
      <ButtonClose onClick={_onRequestClose} />
      {generateFundingLinks()}
    </Modal>
  )
}

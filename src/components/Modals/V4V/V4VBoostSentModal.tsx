import OmniAural, { useOmniAural } from 'omniaural'
import { useTranslation } from 'react-i18next'
import Modal from 'react-modal'
import { ButtonClose } from '~/components'
import { OmniAuralState, V4VBoostResult } from '~/state/omniauralState'

type Props = unknown

export const V4VBoostSentModal = (props: Props) => {
  const [v4vBoostResults] = useOmniAural('v4vBoostResults') as [OmniAuralState['v4vBoostResults']]
  const [v4vBoostSentInfo] = useOmniAural('modals.v4vBoostSentInfo') as [OmniAuralState['modals']['v4vBoostSentInfo']]
  const { show } = v4vBoostSentInfo
  const { t } = useTranslation()

  /* Event Handlers */

  const _onRequestClose = () => {
    OmniAural.modalsHideAll()
  }

  /* Render Helpers */

  const generateSucceeds = () => {
    if (!Array.isArray(v4vBoostResults?.succeededs)) return null
    return v4vBoostResults.succeededs.map((boostResult: V4VBoostResult, index: number) => {
      return (
        <tr key={`v4v-boost-results-succeeded-row-${index}`}>
          <td
            >{`✅ ${boostResult.name}`}
            <div className="address">{boostResult.address}</div>
            {
              boostResult.customKey && (
                <div className="custom-key">Key: {boostResult.customKey}</div>
              )
            }
            {
              boostResult.customValue && (
                <div className="custom-value">Value: {boostResult.customValue}</div>
              )
            }
          </td>
          <td className="center no-wrap">{boostResult.normalizedSplit}</td>
          <td className="center no-wrap">{boostResult.amount}{boostResult.amount < 10 ? "*" : ""}</td>
        </tr>
      )
    })
  }

  const generateErrors = () => {
    if (!Array.isArray(v4vBoostResults?.errors)) return null
    return v4vBoostResults.errors.map((boostResult: V4VBoostResult, index: number) => {
      return (
        <tr className='errors' key={`v4v-boost-results-errored-row-${index}`}>
          <td>
            {`❗ ${boostResult.name}`}
            <div className="address">{boostResult.address}</div>
            {
              boostResult.customKey && (
                <div className="custom-key">Key: {boostResult.customKey}</div>
              )
            }
            {
              boostResult.customValue && (
                <div className="custom-value">Value: {boostResult.customValue}</div>
              )
            }
            {
              boostResult.errorMessage && (
                <div className="error-message">
                  Error: {boostResult.errorMessage}
                </div>
              )
            }
          </td>
          <td className="center no-wrap">{boostResult.normalizedSplit}</td>
          <td className="center no-wrap">{boostResult.amount}{boostResult.amount < 10 ? "*" : ""}</td>
        </tr>
      )
    })
  }

  return (
    <Modal
      className='v4v-boost-sent-info-modal centered'
      contentLabel={t('Boostagram info')}
      isOpen={show}
      onRequestClose={_onRequestClose}
    >
      <ButtonClose onClick={_onRequestClose} />
      <div className="boost-sent-info-modal">
        <div className="boost-sent-info-wrapper">
          <h2>{t('Boostagram info')}</h2>
          <table className="splits-table">
            <tr>
              <th>Name / Address</th>
              <th className="no-wrap">%</th>
              <th className="no-wrap">Total</th>
            </tr>
            {generateSucceeds()}
            {generateErrors()}
          </table>
          <div className="helper-text">* Transactions less than 10 sats are not sent.</div>
        </div>
      </div>
    </Modal>
  )
}

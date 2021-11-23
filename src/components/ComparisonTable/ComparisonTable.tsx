import { faSmile } from '@fortawesome/free-regular-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
  aboveSectionNodes: any
  featuresData: any[]
  headerIcon1: string
  headerIcon2: string
  headerText: string
}

const keyPrefix = 'comparion_table'

export const ComparisonTable = ({ aboveSectionNodes, featuresData, headerIcon1,
  headerIcon2, headerText }: Props) => {

  const dataElements = featuresData && featuresData.map((x: any, index: number) => (
    <div
      className='comparison-table__row'
      key={`${keyPrefix}_${index}`}>
      <div className='comparison-table-row__text'>{x.text}</div>
      <div className='comparison-table-row__icon'>{x.icon1 && <FontAwesomeIcon icon={x.iconType === 'smile' ? faSmile : faCheck} />}</div>
      <div className='comparison-table-row__icon'>{x.icon2 && <FontAwesomeIcon icon={x.iconType === 'smile' ? faSmile : faCheck} />}</div>
    </div>
  ))

  return (
    <div className='comparison-table-wrapper'>
      {aboveSectionNodes && (
        <div className='above-section'>
          {aboveSectionNodes}
        </div>
      )}
      <div className='comparison-table'>
        <div className='comparison-table__header'>
          <div className='comparison-table-header__text'>{headerText}</div>
          <div className='comparison-table-header__icon'>{headerIcon1}</div>
          <div className='comparison-table-header__icon'>{headerIcon2}</div>
        </div>
        {
          dataElements && dataElements.length > 0 &&
          dataElements
        }
      </div>
    </div>
  )
}

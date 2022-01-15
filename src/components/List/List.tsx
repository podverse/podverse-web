import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

type Props = {
  children: any
  hideNoResultsMessage?: boolean
  isLoading?: boolean
}

export const List = ({ children, hideNoResultsMessage }: Props) => {
  const { t } = useTranslation()
  const hasChildren = children && children.length > 0
  const showNoResultsFound = !hideNoResultsMessage && !hasChildren
  const listClass = classNames('list', showNoResultsFound ? 'no-results-found' : '')

  return (
    <ul className={listClass}>
      {showNoResultsFound && <div className='no-results-found-message'>{t('No results found')}</div>}
      {hasChildren && children}
    </ul>
  )
}

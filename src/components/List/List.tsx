import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

type Props = {
  children: any
  hideNoResultsMessage?: boolean
  isLoading?: boolean
  noMarginTop?: boolean
}

export const List = ({ children, hideNoResultsMessage, noMarginTop }: Props) => {
  const { t } = useTranslation()
  const hasChildren = children && children.length > 0
  const listClass = classNames('list', noMarginTop && hasChildren ? 'no-margin-top' : '')

  return (
    <ul className={listClass}>
      {!hideNoResultsMessage && !hasChildren && <div className='no-results-found'>{t('No results found')}</div>}
      {hasChildren && children}
    </ul>
  )
}

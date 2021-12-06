import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

type Props = {
  children: any
  noMarginTop?: boolean
}

export const List = ({ children, noMarginTop }: Props) => {
  const { t } = useTranslation()
  const hasChildren = children && children[0] && children[0].length > 0
  const listClass = classNames('list', noMarginTop && hasChildren ? 'no-margin-top' : '')  

  return (
    <ul className={listClass}>
      {
        !hasChildren && <div className='no-results-found'>{t('No results found')}</div>
      }
      {
        hasChildren && children
      }
    </ul>
  )
}

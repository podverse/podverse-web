import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { PV } from '~/resources'
import { FeatureDemoWidget, PVLink } from '..'

type Props = {
  children: any
  handleSelectByCategory?: any
  handleShowAllPodcasts?: any
  hideNoResultsMessage?: boolean
  isSubscribedFilter?: boolean
  tutorialsLink?: string
  tutorialsLinkText?: string
}

export const List = ({
  children,
  handleSelectByCategory,
  handleShowAllPodcasts,
  hideNoResultsMessage,
  isSubscribedFilter,
  tutorialsLink,
  tutorialsLinkText
}: Props) => {
  const { t } = useTranslation()
  const hasChildren = children && children.length > 0
  const showNoResultsFound = !hideNoResultsMessage && !hasChildren
  const listClass = classNames('list')

  const noResultsTextNode = isSubscribedFilter ? (
    <div className='no-results-found-message'>
      <p>{t('Not subscribed to any podcasts')}</p>
      <p>
        <PVLink href={PV.RoutePaths.web.search}>{t('Search')}</PVLink>
      </p>
      <p>
        <a onClick={handleSelectByCategory}>{t('Select by category')}</a>
      </p>
      <p>
        <a onClick={handleShowAllPodcasts}>{t('Show all podcasts')}</a>
      </p>
    </div>
  ) : (
    <div className='no-results-found-message' tabIndex={0}>
      {t('No results found')}
      {!!tutorialsLink && !!tutorialsLinkText && (
        <FeatureDemoWidget tutorialsLink={tutorialsLink} tutorialsLinkText={tutorialsLinkText} />
      )}
    </div>
  )

  return (
    <ul className={listClass}>
      {showNoResultsFound && noResultsTextNode}
      {hasChildren && children}
      {!showNoResultsFound && !!tutorialsLink && !!tutorialsLinkText && (
        <FeatureDemoWidget marginTopExtra tutorialsLink={tutorialsLink} tutorialsLinkText={tutorialsLinkText} />
      )}
    </ul>
  )
}

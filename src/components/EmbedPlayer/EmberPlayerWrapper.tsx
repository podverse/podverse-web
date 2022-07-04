import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { Icon } from '../Icon/Icon'
import { EmbedPlayerFooter } from './EmbedPlayerFooter'

type Props = {
  children: any
  episodeOnly?: boolean
  hasInitialized?: boolean
  isLoading?: boolean
}

export const EmbedPlayerWrapper = ({ children, episodeOnly, hasInitialized, isLoading }: Props) => {
  const rootClassName = classNames('embed-player', episodeOnly ? 'episode-only' : '')
  const wrapperClassName = classNames('embed-player-wrapper', hasInitialized ? '' : 'has-not-initialized')

  return (
    <div className={rootClassName}>
      {hasInitialized && isLoading && (
        <div className='embed-loading-spinner'>
          <Icon faIcon={faSpinner} spin />
        </div>
      )}
      {!isLoading && (
        <>
          <div className={wrapperClassName}>
            <div className='embed-player-wrapper-top'>{children}</div>
          </div>
          <EmbedPlayerFooter hasInitialized={hasInitialized} />
        </>
      )}
    </div>
  )
}

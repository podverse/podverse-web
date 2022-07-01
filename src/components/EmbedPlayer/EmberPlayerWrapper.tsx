import classNames from 'classnames'
import { EmbedPlayerFooter } from './EmbedPlayerFooter'

type Props = {
  children: any
  episodeOnly?: boolean
  hasInitialized?: boolean
}

export const EmbedPlayerWrapper = ({ children, episodeOnly, hasInitialized }: Props) => {
  const rootClassName = classNames(
    'embed-player',
    episodeOnly ? 'episode-only' : '',
    hasInitialized ? '' : 'has-not-initialized'
  )

  return (
    <div className={rootClassName}>
      <div className='embed-player-wrapper'>
        <div className='embed-player-wrapper-top'>{children}</div>
      </div>
      <EmbedPlayerFooter />
    </div>
  )
}

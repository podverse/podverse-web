import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import { LiveItemStatus } from 'podverse-shared'
import { ButtonRectangle } from '../Buttons/ButtonRectangle'

type Props = {
  liveItemStatus: LiveItemStatus
  hideBelowMobileWidth?: boolean
  hideAboveMobileWidth?: boolean
}

export const LiveStatusBadge = ({ hideAboveMobileWidth, hideBelowMobileWidth, liveItemStatus }: Props) => {
  const { t } = useTranslation()
  const className = classNames(
    hideAboveMobileWidth ? 'hide-above-tablet-min-width' : '',
    hideBelowMobileWidth ? 'hide-below-mobile-max-width' : ''
  )

  if (liveItemStatus === 'live') {
    return (
      <ButtonRectangle
        className={className}
        isDanger
        label={t('Live Now')}
        type='status-badge' />
    )
  } else if (liveItemStatus === 'ended') {
    return (
      <ButtonRectangle
        className={className}
        disabled
        label={t('Live Ended')}
        type='status-badge' />
    )
  } else if (liveItemStatus === 'pending') {
    return (
      <ButtonRectangle
        className={className}
        isSuccess
        label={t('Live Time')}
        type='status-badge' />
    )
  } else {
    return null
  }
}

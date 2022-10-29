import { useTranslation } from 'next-i18next'
import { ButtonRectangle, FeatureDemoWidget } from '~/components'

type Props = {
  actionLabel?: string
  actionOnClick?: any
  message: string
  showFeaturesLink?: boolean
}

export const MessageWithAction = ({ actionLabel, actionOnClick, message, showFeaturesLink = true }: Props) => {
  const { t } = useTranslation()
  return (
    <div className='message-with-action'>
      <div className='message' tabIndex={0}>
        {message}
      </div>
      {actionLabel && actionOnClick && <ButtonRectangle label={actionLabel} onClick={actionOnClick} type='primary' />}
      {showFeaturesLink && (
        <FeatureDemoWidget marginTopExtra tutorialsLink='/membership' tutorialsLinkText={t('Learn more')} />
      )}
    </div>
  )
}

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'next-i18next'

type Props = {
  onClick: any
}

export const ButtonClose = ({ onClick }: Props) => {
  const { t } = useTranslation()

  return (
    <button aria-label={t('Close')} className='button-close' onClick={onClick}>
      <FontAwesomeIcon icon={faTimes} />
    </button>
  )
}

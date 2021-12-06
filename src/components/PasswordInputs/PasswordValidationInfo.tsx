import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import { Icon } from '~/components'

type Props = {
  hasAtLeastXCharacters: boolean
  hasLowercase: boolean
  hasNumber: boolean
  hasUppercase: boolean
}

export const PasswordValidationInfo = ({ hasAtLeastXCharacters, hasLowercase, hasNumber, hasUppercase }: Props) => {
  const { t } = useTranslation()

  return (
    <div className='password-validation-info'>
      <p className={hasUppercase ? 'password-validation-info__is-valid' : ''}>
        {t('password validation - has uppercase')} &nbsp;
        {hasUppercase && <Icon faIcon={faCheck} />}
      </p>
      <p className={hasLowercase ? 'password-validation-info__is-valid' : ''}>
        {t('password validation - has lowercase')} &nbsp;
        {hasLowercase && <Icon faIcon={faCheck} />}
      </p>
      <p className={hasNumber ? 'password-validation-info__is-valid' : ''}>
        {t('password validation - has number')} &nbsp;
        {hasNumber && <Icon faIcon={faCheck} />}
      </p>
      <p className={hasAtLeastXCharacters ? 'password-validation-info__is-valid' : ''}>
        {t('password validation - is at least 8 characters')} &nbsp;
        {hasAtLeastXCharacters && <Icon faIcon={faCheck} />}
      </p>
    </div>
  )
}

import OmniAural from 'omniaural'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateEmail } from '~/lib/utility/validation'
import { ButtonRectangle, PasswordValidationInfo, TextInput } from '~/components'
import {
  validateHasAtLeastXCharacters,
  validateHasLowercase,
  validateHasMatchingStrings,
  validateHasNumber,
  validateHasUppercase,
  validatePassword
} from '~/lib/utility/validation'

type Props = {
  handleClose: any
  handleSubmit: any
  hideEmail?: boolean
  isSignUpPressed?: boolean
}

export const PasswordInputs = ({ handleClose, handleSubmit, hideEmail, isSignUpPressed = false }: Props) => {
  const { t } = useTranslation()
  const [email, setEmail] = useState<string>('')
  const [emailWarningText, setEmailWarningText] = useState<string>('')
  const [password1, setPassword1] = useState<string>('')
  const [password1WarningText, setPassword1WarningText] = useState<string>('')
  const [password1WasShownWarning, setPassword1WasShownWarning] = useState<boolean>(false)
  const [password2, setPassword2] = useState<string>('')
  const [password2WarningText, setPassword2WarningText] = useState<string>('')
  const [hasAtLeastXCharacters, setHasAtLeastXCharacters] = useState<boolean>(false)
  const [hasLowercase, setHasLowercase] = useState<boolean>(false)
  const [hasNumber, setHasNumber] = useState<boolean>(false)
  const [hasUppercase, setHasUppercase] = useState<boolean>(false)
  const [fieldsAreValid, setFieldsAreValid] = useState<boolean>(false)

  useEffect(() => {
    handlePassword1Warning()
    handlePassword2Warning()
    validateFields()
  }, [email, password1, password2])

  const handleEmailOnBlur = () => {
    if (!validateEmail(email)) {
      setEmailWarningText(t('errorMessages:message.PleaseProvideValidEmail'))
    } else {
      setEmailWarningText('')
    }
  }

  const handleEmailOnChange = (value) => {
    setEmail(value)
  }

  const handlePassword1Warning = () => {
    if (!password1WasShownWarning) {
      // Don't show the password1 warning until after first blur event.
    } else if (password1 && !validatePassword(password1)) {
      setPassword1WarningText(t('errorMessages:message.passwordError'))
    } else if (validatePassword(password1)) {
      setPassword1WarningText(t(''))
    }
  }

  const handlePassword1OnBlur = () => {
    if (password1) {
      handlePassword1Warning()
      setPassword1WasShownWarning(true)
    }
  }

  const handlePassword1OnChange = (value) => {
    setPassword1(value)
  }

  const handlePassword2OnBlur = () => {
    handlePassword2Warning()
  }

  const handlePassword2OnChange = (value) => {
    setPassword2(value)
  }

  const handlePassword2Warning = () => {
    if (!password1WarningText && validatePassword(password1) && password2 && password2 !== password1) {
      setPassword2WarningText(t('errorMessages:message.passwordMatchError'))
    } else {
      setPassword2WarningText('')
    }
  }

  const validateFields = () => {
    const hasValidEmail = validateEmail(email)
    const hasAtLeastXCharacters = validateHasAtLeastXCharacters(password1)
    const hasLowercase = validateHasLowercase(password1)
    const hasNumber = validateHasNumber(password1)
    const hasUppercase = validateHasUppercase(password1)
    const hasMatchingPasswords = validateHasMatchingStrings(password1, password2)
    const fieldsAreValid =
      (hideEmail || hasValidEmail) &&
      hasAtLeastXCharacters &&
      hasLowercase &&
      hasNumber &&
      hasUppercase &&
      hasMatchingPasswords

    setHasAtLeastXCharacters(hasAtLeastXCharacters)
    setHasLowercase(hasLowercase)
    setHasNumber(hasNumber)
    setHasUppercase(hasUppercase)

    setFieldsAreValid(fieldsAreValid)
  }

  return (
    <>
      {!hideEmail && (
        <TextInput
          helperText={emailWarningText}
          isDanger={!!emailWarningText}
          label={t('Email')}
          onBlur={handleEmailOnBlur}
          onChange={(value: string) => {
            handleEmailOnChange(value)
            OmniAural.modalsVerifyEmailEmail(value)
          }}
          onSubmit={() => handleSubmit(email, password1)}
          placeholder={t('Email')}
          type='email'
          value={email}
        />
      )}
      <TextInput
        helperText={password1WarningText}
        isDanger={!!password1WarningText}
        label={t('Password')}
        onBlur={handlePassword1OnBlur}
        onChange={handlePassword1OnChange}
        onSubmit={() => handleSubmit(email, password1)}
        placeholder={t('Password')}
        type='password'
        value={password1}
      />
      <TextInput
        helperText={password2WarningText}
        isDanger={!!password2WarningText}
        label={t('Confirm Password')}
        onBlur={handlePassword2OnBlur}
        onChange={handlePassword2OnChange}
        onSubmit={() => handleSubmit(email, password1)}
        placeholder={t('Confirm Password')}
        type='password'
        value={password2}
      />
      <PasswordValidationInfo
        hasAtLeastXCharacters={hasAtLeastXCharacters}
        hasLowercase={hasLowercase}
        hasNumber={hasNumber}
        hasUppercase={hasUppercase}
      />
      <div className='submit-buttons'>
        <ButtonRectangle label={t('Cancel')} onClick={handleClose} type='secondary' />
        <ButtonRectangle
          isLoading={isSignUpPressed}
          disabled={!fieldsAreValid}
          label={t('Submit')}
          onClick={() => handleSubmit(email, password1)}
          type='primary'
        />
      </div>
    </>
  )
}

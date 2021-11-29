import { useState } from "react"
import { useTranslation } from "react-i18next"
import { copyTextToClipboard } from "~/lib/utility/copyToClipboard"
import { TextInput } from ".."

type Props = {
  label: string
  value?: string
}

export const TextInputCopy = ({ label, value }: Props) => {
  const { t } = useTranslation()
  const [wasCopied, setWasCopied] = useState<boolean>(false)

  const _handleCopyToClipboard = () => {
    copyTextToClipboard(value)
    setWasCopied(true)
    setTimeout(() => {
      setWasCopied(false)
    }, 3000)
  }

  return (
    <TextInput
      endButtonText={wasCopied ? t('Copied') : t('Copy')}
      handleEndButtonClick={_handleCopyToClipboard}
      label={label}
      placeholder=''
      readOnly
      type='text'
      value={value} />
  )
}

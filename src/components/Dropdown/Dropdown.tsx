import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Select = require('@podverse/react-dropdown-select').default

type Props = {
  dropdownAriaLabel?: string
  dropdownPosition?: 'auto' | 'top' | 'bottom'
  dropdownWidthClass?: 'width-small' | 'width-medium' | 'width-large' | 'width-full'
  faIcon?: IconProp
  hasClipEditButtons?: boolean
  hideCaret?: boolean
  inlineElementStyle?: boolean
  isLabelUrl?: boolean
  onChange: any
  options: any[]
  outlineStyle?: boolean
  selectedKey?: string | number
  text?: string
  textLabel?: string
}

const contentRenderer = (props: Props, t: any) => {
  const { faIcon, isLabelUrl, options, selectedKey, text, textLabel } = props
  const selectedOption = options?.find((option) => option.key === selectedKey)
  const finalText = text || selectedOption?.label

  return (
    <div className='dropdown-wrapper'>
      {!!faIcon && (
        <div aria-hidden='true' className='dropdown__icon'>
          <FontAwesomeIcon icon={faIcon} />
        </div>
      )}
      {!!finalText && (
        <div aria-hidden='true' className='dropdown__text'>
          {textLabel ? `${textLabel}: ` : ''}
          {isLabelUrl ? finalText : t(`${finalText}`)}
        </div>
      )}
    </div>
  )
}

const dropdownHandleRenderer = (hideCaret?: boolean) => {
  if (hideCaret) {
    return <div className='dropdown__hidden-chevron' />
  } else {
    return (
      <div className='dropdown__chevron'>
        <FontAwesomeIcon icon={faChevronDown} />
      </div>
    )
  }
}

export const Dropdown = (props: Props) => {
  const {
    dropdownAriaLabel,
    dropdownPosition = 'auto',
    dropdownWidthClass = 'width-small',
    hasClipEditButtons,
    inlineElementStyle,
    onChange,
    options,
    outlineStyle,
    selectedKey,
    text
  } = props
  const { t } = useTranslation()
  const wrapperClass = classnames(
    outlineStyle ? 'outline-style' : '',
    dropdownWidthClass ? dropdownWidthClass : '',
    hasClipEditButtons ? 'has-clip-edit-buttons' : '',
    inlineElementStyle ? 'inline-style' : ''
  )

  const selectedOption = options?.find((option) => option.key === selectedKey)
  const finalDropdownAriaLabel = dropdownAriaLabel || text || selectedOption?.label

  return (
    <Select
      additionalProps={{ 'aria-label': finalDropdownAriaLabel, role: 'button' }}
      dropdownAriaDescription={t('ARIA – Dropdown helper description')}
      dropdownPosition={dropdownPosition}
      className={wrapperClass}
      contentRenderer={() => contentRenderer(props, t)}
      disabled={options.length <= 1}
      dropdownHandleRenderer={() => dropdownHandleRenderer(props.hideCaret)}
      labelField='label'
      onChange={options.length > 1 ? onChange : null}
      options={options}
      valueField='key'
      values={[]}
    />
  )
}

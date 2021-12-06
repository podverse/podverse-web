import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import Select from 'react-dropdown-select'
import { useTranslation } from 'react-i18next'

type Props = {
  dropdownWidthClass?: 'width-small' | 'width-medium' | 'width-large'
  faIcon?: IconProp
  hasClipEditButtons?: boolean
  hideCaret?: boolean
  onChange: any
  options: any[]
  outlineStyle?: boolean
  selectedKey?: string
  text?: string
}

const contentRenderer = (props: Props, t: any) => {
  const { faIcon, hideCaret, options, selectedKey, text } = props
  const selectedOption = options?.find((option) => option.key === selectedKey)
  const finalText = text || selectedOption?.label

  return (
    <div className='dropdown-wrapper'>
      {!!faIcon && (
        <div className='dropdown__icon'>
          <FontAwesomeIcon icon={faIcon} />
        </div>
      )}
      {!!finalText && <div className='dropdown__text'>{t(`${finalText}`)}</div>}
    </div>
  )
}

const dropdownHandleRenderer = (hideCaret?: boolean) => {
  if (hideCaret) {
    return <div />
  } else {
    return (
      <div className='dropdown__chevron'>
        <FontAwesomeIcon icon={faChevronDown} />
      </div>
    )
  }
}

export const Dropdown = (props: Props) => {
  const { dropdownWidthClass = 'width-small', hasClipEditButtons, onChange, options, outlineStyle } = props
  const { t } = useTranslation()
  const wrapperClass = classnames(
    outlineStyle ? 'outline-style' : '',
    dropdownWidthClass ? dropdownWidthClass : '',
    hasClipEditButtons ? 'has-clip-edit-buttons' : ''
  )

  return (
    <Select
      className={wrapperClass}
      contentRenderer={() => contentRenderer(props, t)}
      dropdownHandleRenderer={() => dropdownHandleRenderer(props.hideCaret)}
      labelField='label'
      onChange={onChange}
      options={options}
      valueField='key'
      values={[]}
    />
  )
}

import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import Select from 'react-dropdown-select'

type Props = {
  faIcon?: IconProp
  onChange: any
  options: any[]
  outlineStyle?: boolean
  selectedKey?: string
  text?: string
}

const contentRenderer = (props: Props) => {
  const { faIcon, options, selectedKey, text } = props
  const selectedOption = options?.find(option => option.key === selectedKey)
  const finalText = text || selectedOption?.label

  return (
    <div className='dropdown-wrapper'>
      {
        !!faIcon && (
          <div className='dropdown__icon'>
            <FontAwesomeIcon icon={faIcon} />
          </div>
        )
      }
      {
        !!finalText && (
          <div className='dropdown__text'>
            {finalText}
          </div>
        )
      }
    </div>
  )
}

const dropdownHandleRenderer = () => {
  return (
    <div className='dropdown__chevron'>
      <FontAwesomeIcon icon={faChevronDown} />
    </div>
  )
}

export const Dropdown = (props: Props) => {
  const { onChange, options, outlineStyle } = props
  const wrapperClass = classnames(
    outlineStyle ? 'outline-style' : ''
  )

  return (
    <Select
      className={wrapperClass}
      contentRenderer={() => contentRenderer(props)}
      dropdownHandleRenderer={() => dropdownHandleRenderer()}
      labelField='label'
      onChange={onChange}
      options={options}
      valueField='key'
      values={[]}
    />
  )
}

import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-dropdown-select'

type Props = {
  faIcon: IconProp
  onChange: any
  options: any[]
  text?: string
}

const contentRenderer = (faIcon: IconProp, text?: string) => {
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
        !!text && (
          <div className='dropdown__text'>
            {text}
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

export const Dropdown = ({ faIcon, onChange, options, text }: Props) => {
  return (
    <Select
      contentRenderer={() => contentRenderer(faIcon, text)}
      dropdownHandleRenderer={() => dropdownHandleRenderer()}
      labelField='label'
      onChange={onChange}
      options={options}
      valueField='key'
      values={[]}
    />
  )
}

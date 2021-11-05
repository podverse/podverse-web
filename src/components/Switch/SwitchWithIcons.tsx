import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Switch } from '..'

type Props = {
  ariaLabel: string
  faIconBeginning: IconProp
  faIconEnding: IconProp
  checked?: boolean
  onChange: any
}

export const SwitchWithIcons = ({ ariaLabel, checked, faIconBeginning, faIconEnding,
  onChange }: Props) => {
  return (
    <div className='switch-with-icons-wrapper'>
      {
        !!faIconBeginning && (
          <FontAwesomeIcon className='beginning' icon={faIconBeginning} />
        )
      }
      <Switch
        ariaLabel={ariaLabel}
        checked={checked}
        onChange={onChange} />
      {
        !!faIconEnding && (
          <FontAwesomeIcon className='ending' icon={faIconEnding} />
        )
      }
    </div>
  )
}

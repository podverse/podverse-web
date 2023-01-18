import classnames from 'classnames'
import { Dropdown } from '~/components'
import { PV } from '~/resources'

type Props = {
  ariaDescription?: string
  ariaLabel?: string
  ariaPressed?: boolean
  className?: string
  linkUrl?: string
  onChange?: any
  size: 'small' | 'medium' | 'large'
  playSpeed: number
  children?: any
}

export const PlaySpeed = ({ ariaDescription, ariaLabel, ariaPressed, className, onChange, playSpeed }: Props) => {
  const wrapperClass = classnames(className, 'player-option-button')

  const DropdownOptions = PV.Player.speedOptions

  return (
    <div className={wrapperClass}>
      <Dropdown
        aria-label={ariaLabel}
        aria-pressed={ariaPressed}
        options={DropdownOptions}
        dropdownAriaLabel={ariaDescription}
        dropdownPosition={'top'}
        dropdownWidthClass={
          'width-small'
          // 'width-medium'
          // 'width-large'
          //  |
          // 'width-full'
        }
        // faIcon?: IconProp
        // hasClipEditButtons?: boolean
        hideCaret={true}
        inlineElementStyle={false}
        // isLabelUrl?: boolean
        onChange={(a) => {
          let newSpeed = null

          if (a[0].value === -1) {
            const promptInput = prompt('Please enter your play speed', '3.12')
            // TODO: add validation
            newSpeed = parseFloat(promptInput)
            onChange(newSpeed)
          } else {
            newSpeed = a[0].value
            onChange(newSpeed)
          }
        }}
        // options: any[]
        outlineStyle={false}
        // selectedKey?: string | number
        text={playSpeed + 'x'}
      />
    </div>
  )
}

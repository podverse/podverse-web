import classnames from 'classnames'
import { Dropdown } from '~/components'

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

  return (
    <div className={wrapperClass}>
      <Dropdown
        aria-label={ariaLabel}
        aria-pressed={ariaPressed}
        // options={[]}
        options={[
          { i18nKey: `Custom (${playSpeed})`, value: 3, key: '_custom' },
          { i18nKey: '0.5', value: 0.5, key: '_playKey' },
          { i18nKey: '0.75', value: 0.75, key: '_queueNextKey' },
          { i18nKey: '1', value: 1, key: '_queueLastKey' },
          { i18nKey: '1.25', value: 1.25, key: '_addToPlaylistKey' },
          { i18nKey: '1.50', value: 1.5, key: '_shareKey' },
          { i18nKey: '1.75', value: 1.75, key: '_key1' },
          { i18nKey: '2', value: 2, key: '_key2' }
        ]}
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
          onChange(a[0].value)
        }}
        // options: any[]
        outlineStyle={false}
        // selectedKey?: string | number
        text={playSpeed + 'x'}
      />
    </div>
  )
}

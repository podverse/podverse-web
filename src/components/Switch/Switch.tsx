import classNames from 'classnames'
import ReactSwitch from 'react-switch'

type Props = {
  ariaLabel: string
  checked?: boolean
  onChange: any
}
export const Switch = ({ ariaLabel, checked, onChange }: Props) => {
  const switchClass = classNames(
    checked ? 'is-on' : 'is-off'
  )

  return (
    <div className='switch'>
      <ReactSwitch
        aria-label={ariaLabel}
        checked={checked}
        checkedIcon={false}
        className={switchClass}
        height={22}
        onChange={onChange}
        uncheckedIcon={false}
        width={37}
      />
    </div>
  )
}

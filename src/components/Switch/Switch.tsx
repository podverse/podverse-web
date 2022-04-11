import classNames from 'classnames'

// TODO: temporarily using require instead of require to work around a build error happening
// in the Github action pipeline: "'PlayerAudio' cannot be used as a JSX component."
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ReactSwitch = require('react-switch').default

type Props = {
  ariaLabel: string
  checked?: boolean
  onChange: any
}

export const Switch = ({ ariaLabel, checked, onChange }: Props) => {
  const switchClass = classNames(checked ? 'is-on' : 'is-off')

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

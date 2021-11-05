import { Component } from 'react'
import ReactSwitch from 'react-switch'

type Props = {
  ariaLabel: string
  checked?: boolean
  onChange: any
}

type State = {
  checked: boolean
}

export class Switch extends Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      checked: !!this.props.checked
    }
  }

  render() {
    const { ariaLabel, onChange } = this.props
    const { checked } = this.state

    return (
      <div className='switch'>
        <ReactSwitch
          aria-label={ariaLabel}
          checked={checked}
          checkedIcon={false}
          height={22}
          onChange={onChange}
          uncheckedIcon={false}
          width={37} />
      </div>
    );
  }
}

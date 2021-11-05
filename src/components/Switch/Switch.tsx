import { Component } from 'react'
import ReactSwitch from 'react-switch'

type Props = {
  checked?: boolean
  label: string
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
    const { label, onChange } = this.props
    const { checked } = this.state

    return (
      <label>
        <span>{label}</span>
        <ReactSwitch
          checked={checked}
          onChange={onChange} />
      </label>
    );
  }
}

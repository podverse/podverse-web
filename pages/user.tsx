import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Meta from '~/components/meta'
import { pageIsLoading, userSetInfo } from '~/redux/actions'

type Props = {
  user?: any
  userId?: string
  userSetInfo?: any
}

type State = {}

class User extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    store.dispatch(pageIsLoading(false))

    const userId = query.id
    return { userId }
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    // const { user } = this.props
    // const isLoggedIn = user && !!user.id
    const { userId } = this.props
    console.log(userId)
    return (
      <div className='user-profile'>
        <Meta />
        <h3>User Profile</h3>
      </div>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  userSetInfo: bindActionCreators(userSetInfo, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(User)

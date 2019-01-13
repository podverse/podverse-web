import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Meta from '~/components/meta'
import { pageIsLoading } from '~/redux/actions'

type Props = {}

type State = {}

class About extends Component<Props, State> {

  static async getInitialProps({ store }) {
    store.dispatch(pageIsLoading(false))
    return {}
  }

  render() {
    return (
      <Fragment>
        <Meta />
        <h3>About</h3>
        <p>Create and share podcast highlights</p>
        <p>Create and share playlists</p>
        <p>Share your user profile</p>
        <p>Free and open source software <i className="fa fa-copyright fa-flip-horizontal"></i></p>
        <p>Will never sell user data</p>
        <hr />
        <h3>Team</h3>
        <p>Creon Creonopoulos - Programmer</p>
        <p>Mitch Downey – Programmer</p>
        <p>Gary Johnson - UX / Graphic Designer</p>
        <p>Vincent Schramer – Programmer</p>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(About)
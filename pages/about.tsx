import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Meta from '~/components/Meta/Meta'
import { getUrlFromRequestOrWindow } from '~/lib/utility'
import { pageIsLoading } from '~/redux/actions'
import { bindActionCreators } from 'redux';

type Props = {
  meta?: any
}

type State = {}

class About extends Component<Props, State> {

  static async getInitialProps({ req, store }) {
    store.dispatch(pageIsLoading(false))

    const meta = {
      currentUrl: getUrlFromRequestOrWindow(req),
      description: 'Information about Podverse, our people, and our technology.',
      title: 'About'
    }

    return { meta }
  }

  render() {
    const { meta } = this.props

    return (
      <Fragment>
        <Meta
          description={meta.description}
          ogDescription={meta.description}
          ogTitle={meta.title}
          ogType='website'
          ogUrl={meta.currentUrl}
          robotsNoIndex={false}
          title={meta.title}
          twitterDescription={meta.description}
          twitterTitle={meta.title} />
        <h3>About</h3>
        <p>Create and share highlights</p>
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

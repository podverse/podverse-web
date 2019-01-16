import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Meta from '~/components/Meta/Meta'
import { getUrlFromRequestOrWindow } from '~/lib/utility'
import { pageIsLoading } from '~/redux/actions'

type Props = {
  meta?: any
}

type State = {}

class Terms extends Component<Props, State> {

  static async getInitialProps({ req, store }) {
    store.dispatch(pageIsLoading(false))

    const meta = {
      currentUrl: getUrlFromRequestOrWindow(req),
      description: `Podverse's terms of service agreement.`,
      title: `Terms of Service`
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
        <h4>Terms of Service</h4>
        <p>
          <i>Podverse:</i>
        </p>
        <p>
          Does not host or edit podcast audio files. All audio files on podverse.fm are referenced from links in publicly available podcast feeds.
        </p>
        <p>
          Clips load within the full episode's media file, so the listener always has access to the full media file.
        </p>
        <p>
          Does not put advertisements next to or within a podcast's content, without that podcast's permission.
        </p>
        <p>
          Hosts podcast links and content from third-party podcast feeds and sites. These have their own independent privacy policies, and we have no responsibility for their content or activities.
        </p>
        <p>
          Will never sell user data.
        </p>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Terms)
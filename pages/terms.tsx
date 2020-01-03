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
      description: `Podverse terms of service agreement.`,
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
        <h3>Terms of Service</h3>
        <p>
          Podverse will never sell or share private user data.
        </p>
        <p>
          We will never put advertisements next to or within a podcast's content without that podcast's permission.
        </p>
        <p>
          All audio files found on podverse.fm load from the podcaster's own public server. We do not host podcast audio files ourselves.
        </p>
        <p>
          All clips hosted on podverse.fm are crowd-sourced and unofficial, unless otherwise noted by the podcaster themselves.
        </p>
        <p>
          Clips load within the full episode's media file, so the user always has access to the full recording.
        </p>
        <p>
          We host podcast links and content from third-party podcast feeds and sites. These have their own independent privacy policies, and we have no responsibility for their content or activities.
        </p>
        <p>
          We also host reduced size podcast images from podcasters' feeds, to save user network data and speed up page loading times.
        </p>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Terms)
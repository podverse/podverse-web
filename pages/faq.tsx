import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Meta from '~/components/meta'
import { pageIsLoading } from '~/redux/actions'

type Props = {}

type State = {}

class FAQ extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    store.dispatch(pageIsLoading(false))
    return {}
  }

  render () {
    return (
      <Fragment>
        <Meta />
        <h3>FAQ</h3>
        <p><a href='https://goo.gl/forms/VGVJRWlKPIGRqojY2' target='_blank'>Ask a question</a></p>
        <h4>Table of Contents</h4>
        <ul>
          <li>
            <a href='#edit-clips'>How do I edit my clips?</a>
          </li>
          <li>
            <a href='#my-clips'>How do I find my clips?</a>
          </li>
          <li>
            <a href='#agplv3'>What does AGPLv3 mean?</a>
          </li>
          <li>
            <a href='#monopoly-proof'>How is Podverse monopoly-proof?</a>
          </li>
        </ul>
        <hr />
        <h4 id='edit-clips'>How do I edit my clips?</h4>
        <p>
          In order to edit a clip, <u>you must have been logged in when you created the clip</u>. After you create the clip, open it on the website or the iOS mobile app, and there will be an <i>Edit Clip</i> button on the right hand side of the page.
        </p>
        <p>
          <b>iOS:</b> open the clip in the media player, then tap <i>Edit Clip</i>.
        </p>
        <div className='info-img'>
          <img className='responsive' src='/static/images/edit-clip-ios.png' />
        </div>
        <hr />
        <h4 id='my-clips'>How do I find my clips?</h4>
        <p>
          If you <u>are not logged in</u> when you create a clip, then you must save the link to the clip if you want to find it later.
        </p>
        <p>
          If you <u>are logged in</u> when you create a clip, then you can find it in your My Clips list at any time on web or iOS.
        </p>
        <p>
          <b>iOS:</b> Go to the Clips page, click the dropdown in the upperleft corner, then select My Clips.
        </p>
        <div className='info-img'>
          <img className='responsive' src='/static/images/my-clips-ios.png' />
        </div>
        <hr />
        <h4 id='agplv3'>What does AGPLv3 mean?</h4>
        <p>
          <a href='https://www.gnu.org/licenses/agpl-3.0.en.html' target='_blank'>AGPLv3</a> is the open source license under which all Podverse technolgy is provided.
        </p>
        <hr />
        <h4 id='monopoly-proof'>How is Podverse monopoly-proof?</h4>
        <p>
          Podverse software is distributed under the AGPLv3 open source license, which allows anyone to freely use, modify, and distribute the software, as long as they share their modifications as well. The share-alike requirement of the AGPLv3 ensures that the code is and will always remain free.
        </p>
        <p>
          Also, to prevent data lock-in, future releases of Podverse will be built in accordance with podcast open data standards, so that all Podverse data will be easily compatible with any app that follows those same data standards. The benefit of this is, if you wanted to stop using Podverse and use a different podcast app instead, you could download all your Podverse data and transfer it into the competitor's app, and get up and running without losing anything in the process. Even further than that, you could use multiple different podcast apps, but share data between all of them, so they are always in sync with one another.
        </p>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(FAQ)

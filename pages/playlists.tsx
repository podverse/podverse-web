
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { MediaListItem } from 'podverse-ui'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import { getViewContentsElementScrollTop } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import { getPlaylistsByQuery } from '~/services'
import PV from '~/lib/constants'
import { withTranslation } from '~/../i18n'
const uuidv4 = require('uuid/v4')
const { BASE_URL } = config()

type Props = {
  lastScrollPosition?: number
  myPlaylists: any[]
  pageIsLoading?: any
  pageKey?: string
  pagesSetQueryState?: any
  subscribedPlaylists: any[]
  t?: any
  user: any
}

type State = {}

const kPageKey = 'playlists'

class Playlists extends Component<Props, State> {

  static async getInitialProps({ req, store }) {
    const state = store.getState()
    const { pages, user } = state

    const subscribedPlaylistIds = user.subscribedPlaylistIds || []

    const myPlaylists = (user && user.playlists) || []

    const currentPage = pages[kPageKey] || {}
    const lastScrollPosition = currentPage.lastScrollPosition

    let subscribedPlaylists = []
    if (subscribedPlaylistIds && subscribedPlaylistIds.length > 0) {
      const subscribedPlaylistsData = await getPlaylistsByQuery({
        from: PV.queryParams.subscribed_only,
        subscribedPlaylistIds
      })
      subscribedPlaylists = subscribedPlaylistsData.data
    }

    store.dispatch(pageIsLoading(false))

    const namespacesRequired = PV.nexti18next.namespaces

    return { lastScrollPosition, myPlaylists, namespacesRequired, pageKey: kPageKey, subscribedPlaylists,
      user }
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  linkClick = () => {
    const { pageIsLoading, pageKey, pagesSetQueryState } = this.props
    pageIsLoading(true)

    const scrollPos = getViewContentsElementScrollTop()
    pagesSetQueryState({
      pageKey,
      lastScrollPosition: scrollPos
    })
  }

  render() {
    const { myPlaylists, subscribedPlaylists, t, user } = this.props

    const meta = {
      currentUrl: BASE_URL + PV.paths.web.playlists,
      description: t('pages:playlists._Description'),
      title: t('pages:playlists._Title')
    }
    
    const myPlaylistNodes = myPlaylists.map(x => (
        <MediaListItem
          dataPlaylist={x}
          handleLinkClick={this.linkClick}
          hasLink
          itemType='playlist'
          key={`media-list-item-${uuidv4()}`} />
    ))

    const subscribedPlaylistNodes = subscribedPlaylists.map(x => (
      <MediaListItem
        dataPlaylist={x}
        handleLinkClick={this.linkClick}
        hasLink
        itemType='playlist'
        key={`media-list-item-${uuidv4()}`}
        showOwner />
    ))

    return (
      <Fragment>
        <Meta
          description={meta.description}
          ogDescription={meta.description}
          ogTitle={meta.title}
          ogType='website'
          ogUrl={meta.currentUrl}
          robotsNoIndex={true}
          title={meta.title}
          twitterDescription={meta.description}
          twitterTitle={meta.title} />
        <h3>{t('Playlists')}</h3>
        {
          (!user || !user.id) &&
            <div className='no-results-msg'>
              {t('LoginToViewYourPlaylists')}
            </div>
        }
        {
          (user && user.id) &&
            <div className='reduced-margin playlists'>
              <div className='media-list'>
                {
                  (myPlaylistNodes && myPlaylistNodes.length > 0) &&
                    myPlaylistNodes
                }
                {
                  (myPlaylistNodes.length === 0) &&
                    <div className='no-results-msg'>
                      {t('No playlists found')}
                    </div>
                }
              </div>
              {
                (subscribedPlaylistNodes && subscribedPlaylistNodes.length > 0) &&
                  <Fragment>
                    <div className='media-list'>
                      {subscribedPlaylistNodes}
                    </div>
                  </Fragment>
              }
            </div>
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(Playlists))

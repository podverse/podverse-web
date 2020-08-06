/* NOTE! THE HOME PAGE IS AN EXACT COPY OF clips.tsx */

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage } from 'podverse-ui'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import PV from '~/lib/constants'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { clone, cookieGetQuery } from '~/lib/utility'
import {
  pageIsLoading, pagesSetQueryState, playerQueueLoadSecondaryItems
} from '~/redux/actions'
import { getCategoriesByQuery, getMediaRefsByQuery } from '~/services'
import { withTranslation } from '../i18n'
const { BASE_URL } = config()

type Props = {
  allCategories?: any[]
  categoryId?: string
  lastScrollPosition?: number
  listItems?: any
  pageKey?: string
  pagesSetQueryState?: any
  playerQueue?: any
  queryFrom?: any
  queryPage: number
  querySort?: any
  queryType?: any
  t?: any
  user?: any
  userSetInfo?: any
}

type State = {}

const kPageKey = 'clips'

class Home extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const allCategoriesAndCountResult = await getCategoriesByQuery({})
    const allCategories = allCategoriesAndCountResult.data[0] || []

    const state = store.getState()
    const { mediaPlayer, pages, user } = state
    const { nowPlayingItem } = mediaPlayer

    const localStorageQuery = cookieGetQuery(req, kPageKey)
    const currentPage = pages[kPageKey] || {}
    const lastScrollPosition = currentPage.lastScrollPosition
    const queryRefresh = !!query.refresh
    const categoryId = query.categoryId || currentPage.categoryId || localStorageQuery.categoryId
    const queryFrom = currentPage.queryFrom || query.from || (query.categoryId && PV.queryParams.from_category) || localStorageQuery.from || (user && user.id ? PV.queryParams.subscribed_only : PV.queryParams.all_podcasts)
    const queryPage = (queryRefresh && 1) || currentPage.queryPage || query.page || 1
    const querySort = currentPage.querySort || query.sort || localStorageQuery.sort || PV.queryParams.top_past_week
    const queryType = (queryRefresh && query.type) || currentPage.queryType || query.type ||
      localStorageQuery.type || PV.queryParams.clips
    let podcastId = ''

    if (queryFrom === PV.queryParams.subscribed_only) {
      podcastId = user.subscribedPodcastIds
    }

    if (Object.keys(currentPage).length === 0 || queryRefresh) {
      const results = await getMediaRefsByQuery({
        from: queryFrom,
        includePodcast: true,
        page: queryPage,
        ...(podcastId ? { podcastId } : {}),
        sort: querySort,
        type: queryType,
        ...(categoryId ? { categories: categoryId } : {}),
      })

      const listItems = results.data[0].map(x => convertToNowPlayingItem(x, null, null)) || []
      const nowPlayingItemIndex = listItems.map((x) => x.clipId).indexOf(nowPlayingItem && nowPlayingItem.clipId)
      const queuedListItems = clone(listItems)
      if (nowPlayingItemIndex > -1) {
        queuedListItems.splice(0, nowPlayingItemIndex + 1)
      }

      store.dispatch(playerQueueLoadSecondaryItems(queuedListItems))

      store.dispatch(pagesSetQueryState({
        pageKey: kPageKey,
        categoryId,
        listItems,
        listItemsTotal: results.data[1],
        queryFrom,
        queryPage,
        querySort,
        queryType,
      }))
    }

    store.dispatch(pageIsLoading(false))

    const namespacesRequired = PV.nexti18next.namespaces

    return {
      allCategories, lastScrollPosition, namespacesRequired, pageKey: kPageKey,
      queryFrom, queryPage, querySort, queryType
    }
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    const { playerQueue } = this.props
    const { secondaryItems } = playerQueue
    clearItemsFromSecondaryQueueStorage()
    addItemsToSecondaryQueueStorage(secondaryItems)
  }

  render() {
    const { allCategories, categoryId, pagesSetQueryState, queryFrom, queryPage, querySort,
      queryType, t } = this.props

    const meta = {
      currentUrl: BASE_URL,
      description: t('pages:index._Description'),
      title: t('pages:index._Title')
    }

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
        <h3>{t('Clips')}</h3>
        {/* <button
          type='button'
          onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en')}>
          {t('change-locale')}
        </button> */}
        <MediaListCtrl
          adjustTopPosition
          allCategories={allCategories}
          categoryId={categoryId}
          handleSetPageQueryState={pagesSetQueryState}
          pageKey={kPageKey}
          queryFrom={queryFrom}
          queryPage={queryPage}
          querySort={querySort}
          queryType={queryType} />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(Home))

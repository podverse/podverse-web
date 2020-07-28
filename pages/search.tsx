import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ButtonGroup, Form, FormGroup, Input, InputGroup, InputGroupAddon } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, MediaListItem, Pagination } from 'podverse-ui'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import PV from '~/lib/constants'
import { enrichPodcastsWithCategoriesString, safeAlert } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import { getPodcastsByQuery } from '~/services'
const uuidv4 = require('uuid/v4')
const { BASE_URL, QUERY_PODCASTS_LIMIT, REQUEST_PODCAST_URL } = config()

type Props = {
  lastScrollPosition?: number
  meta?: any
  pageIsLoading?: any
  pageKey?: string
  pages?: any
  pagesSetQueryState?: any
  settings?: any
}

type State = {
  currentSearch?: string
  searchCompleted?: boolean
}

const kPageKey = 'search'

class Search extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    store.dispatch(pageIsLoading(false))
    const state = store.getState()
    const { pages } = state

    const currentPage = pages[kPageKey] || {}
    const lastScrollPosition = currentPage.lastScrollPosition
    const querySearchBy = currentPage.searchBy || query.searchBy || PV.query.podcast

    store.dispatch(pagesSetQueryState({ 
      pageKey: kPageKey,
      searchBy: querySearchBy
    }))

    const meta = {
      currentUrl: BASE_URL + PV.paths.web.search,
      description: PV.pages.search._Description,
      title: PV.pages.search._Title
    }

    return { lastScrollPosition, meta, pageKey: kPageKey }
  }

  constructor(props) {
    super(props)

    this.state = {
      currentSearch: '',
      searchCompleted: false
    }
  }

  handleSearchByChange = searchBy => {
    const { pagesSetQueryState } = this.props
    pagesSetQueryState({
      pageKey: kPageKey,
      listItems: [],
      searchBy
    })

    this.setState({ searchCompleted: false })
  }

  handleSearchInputChange = event => {
    const { value: currentSearch } = event.target
    this.setState({
      currentSearch,
      searchCompleted: false
    })
  }

  queryPodcasts = async (page = 1) => {
    const { pages, pagesSetQueryState } = this.props
    const { searchBy } = pages[kPageKey]
    const { currentSearch } = this.state
    
    if (!currentSearch) { return }

    const query = { 
      page,
      searchBy,
      searchText: currentSearch
    }

    pagesSetQueryState({
      pageKey: kPageKey,
      isSearching: page === 1,
      queryPage: page,
      searchText: currentSearch
    })

    try {
      const response = await getPodcastsByQuery(query)
      const podcasts = response.data || []
      const enrichedPodcasts = enrichPodcastsWithCategoriesString(podcasts[0])

      pagesSetQueryState({
        pageKey: kPageKey,
        isSearching: false,
        listItems: enrichedPodcasts,
        listItemsTotal: podcasts[1]        
      })

      this.setState({ searchCompleted: true })

    } catch (error) {
      console.log(error)
      safeAlert(PV.core.SearchError)
    }
  }

  linkClick = () => {
    const { pageIsLoading } = this.props
    pageIsLoading(true)
  }

  handleQueryPage = async page => {
    const { pageIsLoading } = this.props
    pageIsLoading(true)
    await this.queryPodcasts(page)
    pageIsLoading(false)

    const mediaListSelectsEl = document.querySelector('.search__by')
    if (mediaListSelectsEl) {
      mediaListSelectsEl.scrollIntoView()
    }
  }

  render() {
    const { meta, pages } = this.props
    const { isSearching, listItems, listItemsTotal, queryPage, searchBy } = pages[kPageKey]
    const { currentSearch, searchCompleted } = this.state

    const placeholder = searchBy === PV.query.host
      ? PV.pages.search.searchByHost : PV.pages.search.searchByTitle

      
    const listItemNodes = listItems ? listItems.map(x => {
      return (
        <MediaListItem
          dataPodcast={x}
          handleLinkClick={this.linkClick}
          hasLink={true}
          itemType='podcast-search-result'
          key={`podcast-list-item-${uuidv4()}`} />
      )
    }) : null

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
        <h3>Search</h3>
        <Form
          autoComplete='off'
          className='search'>
          <FormGroup>
            <ButtonGroup
              className='search__by'>
              <Button
                className='search-by__podcast'
                color='secondary'
                isActive={searchBy === 'podcast'}
                onClick={() => this.handleSearchByChange('podcast')}
                outline>
                Podcast
              </Button>
              <Button
                className='search-by__host'
                color='secondary'
                isActive={searchBy === 'host'}
                onClick={() => this.handleSearchByChange('host')}
                outline>
                Host
              </Button>
            </ButtonGroup>
            <InputGroup>
              <Input
                aria-label='Search input'
                className='search__input'
                name='search'
                onChange={this.handleSearchInputChange}
                onKeyPress={target => {
                  if (target.charCode === 13) {
                    target.nativeEvent.preventDefault()
                    this.queryPodcasts()
                  }
                }}
                placeholder={placeholder}
                type='text'
                value={currentSearch} />
              <InputGroupAddon addonType='append'>
                <Button
                  className='search__input-btn'
                  color='primary'
                  isLoading={isSearching}
                  onClick={() => this.queryPodcasts()}>
                  <FontAwesomeIcon icon='search' />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>
        </Form>
        <div className={'media-list adjust-top-position'}>
          {
            listItemNodes && listItemNodes.length > 0 &&
            <Fragment>
              {listItemNodes}
              <Pagination
                currentPage={queryPage || 1}
                handleQueryPage={this.handleQueryPage}
                pageRange={2}
                totalPages={Math.ceil(listItemsTotal / QUERY_PODCASTS_LIMIT)} />
            </Fragment>
          }
          {
            (!isSearching && searchCompleted && listItemNodes && listItemNodes.length === 0) &&
              <div className='no-results-msg'>
                {PV.core.noResultsMessage(PV.core.podcasts, searchBy === PV.query.host ? 'with that host' : '')}
              </div>
          }
          {
            !isSearching &&
              <a
                className='request-podcast'
                href={REQUEST_PODCAST_URL}
                rel="noopener noreferrer"
                target='_blank'>
                {PV.core.RequestAPodcast}
              </a>
          }
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Search)
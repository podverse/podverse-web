import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ButtonGroup, Form, FormGroup, Input, InputGroup, InputGroupAddon } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MediaListItem, PVButton as Button } from 'podverse-ui'
import Meta from '~/components/Meta/Meta'
import { getUrlFromRequestOrWindow } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState } from '~/redux/actions'
import { getPodcastsByQuery } from '~/services'
const uuidv4 = require('uuid/v4')

type Props = {
  meta?: any
  pageIsLoading?: any
  pages?: any
  pagesSetQueryState?: any
  settings?: any
}

type State = {
  currentSearch?: string
}

const kPageKey = 'search'

class Search extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    store.dispatch(pageIsLoading(false))
    const state = store.getState()
    const { pages } = state

    const currentPage = pages[kPageKey] || {}
    const querySearchBy = currentPage.searchBy || query.searchBy || 'podcast'

    store.dispatch(pagesSetQueryState({ 
      pageKey: kPageKey,
      searchBy: querySearchBy
    }))

    const meta = {
      currentUrl: getUrlFromRequestOrWindow(req),
      description: 'Search for podcasts by title or host on Podverse.',
      title: 'Search'
    }

    return { meta }
  }

  constructor(props) {
    super(props)

    this.state = {
      currentSearch: ''
    }

    this.handleSearchByChange = this.handleSearchByChange.bind(this)
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this)
    this.linkClick = this.linkClick.bind(this)
    this.queryPodcasts = this.queryPodcasts.bind(this)
  }

  handleSearchByChange(searchBy) {
    const { pagesSetQueryState } = this.props
    pagesSetQueryState({
      pageKey: kPageKey,
      searchBy
    })
  }

  handleSearchInputChange(event) {
    const { value: currentSearch } = event.target
    this.setState({ currentSearch })
  }

  async queryPodcasts(queryPage = 1, loadMore = false) {
    const { pages, pagesSetQueryState, settings } = this.props
    const { nsfwMode } = settings
    const { listItems, searchBy, searchText } = pages[kPageKey]
    const { currentSearch } = this.state
    
    if (!currentSearch) { return }

    const query = { 
      page: queryPage,
      searchBy,
      searchText: loadMore ? searchText : currentSearch
    }

    pagesSetQueryState({
      pageKey: kPageKey,
      isLoadingMore: loadMore,
      isSearching: !loadMore,
      searchText: loadMore ? searchText : currentSearch
    })

    let combinedListItems: any = []

    if (queryPage > 1) {
      combinedListItems = listItems
    }

    try {
      const response = await getPodcastsByQuery(query, nsfwMode)
      const podcasts = response.data || []
      combinedListItems = combinedListItems.concat(podcasts)
      
      pagesSetQueryState({
        pageKey: kPageKey,
        endReached: podcasts.length < 2,
        isLoadingMore: false,
        isSearching: false,
        listItems: queryPage > 1 ? combinedListItems : podcasts,
        queryPage
      })

    } catch (error) {
      console.log(error)
      alert('Search failed. Please check your internet connection and try again.')
    }
  }

  linkClick() {
    const { pageIsLoading } = this.props
    pageIsLoading(true)
  }

  render() {
    const { meta, pages } = this.props
    const { endReached, isLoadingMore, isSearching, listItems, queryPage, searchBy } = pages[kPageKey]
    const { currentSearch } = this.state

    const placeholder = searchBy === 'host'
      ? 'search by host' : 'search by title'

    const listItemNodes = listItems ? listItems.map(x => {
      return (
        <MediaListItem
          dataPodcast={x}
          handleLinkClick={this.linkClick}
          hasLink={true}
          itemType='podcast'
          key={`podcast-list-item-${uuidv4()}`} />
      )
    }) : null

    return (
      <Fragment>
        <Meta
          description={meta.description}
          ogDescription={meta.description}
          ogImage={meta.imageUrl}
          ogTitle={meta.title}
          ogType='website'
          ogUrl={meta.currentUrl}
          robotsNoIndex={false}
          title={meta.title}
          twitterDescription={meta.description}
          twitterImage={meta.imageUrl}
          twitterImageAlt={meta.imageAlt}
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
                    this.queryPodcasts(1, false)
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
                  onClick={() => this.queryPodcasts(1, false)}>
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
              <div className='media-list__load-more'>
                {
                  endReached ?
                    <p className='no-results-msg'>End of results</p>
                    : <Button
                      className='media-list-load-more__button'
                      disabled={isLoadingMore}
                      isLoading={isLoadingMore}
                      onClick={() => this.queryPodcasts(queryPage + 1, true)}
                      text='Load More' />
                }
              </div>
            </Fragment>
          }
          {
            (!endReached && listItemNodes && listItemNodes.length === 0) &&
            <div className='no-results-msg'>No podcasts found</div>
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
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Form, FormGroup, Input, InputGroup, InputGroupAddon } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MediaListItem, PVButton as Button } from 'podverse-ui'
import Meta from '~/components/meta'
import { pageIsLoading } from '~/redux/actions'
import { getPodcastsByQuery } from '~/services'
const uuidv4 = require('uuid/v4')

type Props = {
  pageIsLoading?: any
  settings?: any
}

type State = {
  endReached?: boolean
  isLoadingMore?: boolean
  isSearching?: boolean
  podcasts?: any[]
  queryPage: number
  searchBy?: string
  searchText?: string
}

class Search extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    store.dispatch(pageIsLoading(false))
    return {}
  }

  constructor(props) {
    super(props)

    this.state = {
      queryPage: 1,
      searchBy: 'podcast',
      searchText: ''
    }

    this.handleSearchByChange = this.handleSearchByChange.bind(this)
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this)
    this.linkClick = this.linkClick.bind(this)
    this.queryPodcasts = this.queryPodcasts.bind(this)
  }

  handleSearchByChange(searchBy) {
    this.setState({ searchBy })
  }

  handleSearchInputChange(event) {
    const { value: searchText } = event.target
    this.setState({ searchText })
  }

  async queryPodcasts(queryPage = 1, loadMore = false) {
    this.setState({
      isLoadingMore: loadMore,
      isSearching: !loadMore
    })

    const { settings } = this.props
    const { nsfwMode } = settings
    const { podcasts, searchBy, searchText } = this.state

    try {
      const query = { 
        page: queryPage,
        searchBy,
        searchText
      }
      const response = await getPodcastsByQuery(query, nsfwMode)
      const newPodcasts = response.data || []

      let combinedPodcasts: any = []

      if (queryPage > 1) {
        combinedPodcasts = podcasts
      }

      combinedPodcasts = combinedPodcasts.concat(newPodcasts)
      
      this.setState({
        endReached: newPodcasts.length < 2,
        isLoadingMore: false,
        isSearching: false,
        podcasts: combinedPodcasts,
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
    const { endReached, isLoadingMore, isSearching, podcasts, queryPage, searchBy,
      searchText } = this.state

    const placeholder = searchBy === 'podcast' ? 'search by podcast title' : 'search by podcast host'

    const podcastNodes = podcasts ? podcasts.map(x => {
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
        <Meta />
        <h3>Search</h3>
        <Form
          autoComplete='off'
          className='search'>
          <FormGroup>
            {/* <ButtonGroup
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
            </ButtonGroup> */}
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
                value={searchText} />
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
            podcastNodes && podcastNodes.length > 0 &&
            <Fragment>
              {podcastNodes}
              <div className='media-list__load-more'>
                {
                  endReached ?
                    <p>End of results</p>
                    : <Button
                      className='media-list-load-more__button'
                      isLoading={isLoadingMore}
                      onClick={() => this.queryPodcasts(queryPage + 1, true)}
                      text='Load More' />
                }
              </div>
            </Fragment>
          }
          {
            (!endReached && podcastNodes && podcastNodes.length === 0) &&
            <div className='no-results-msg'>No podcasts found</div>
          }
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Search)
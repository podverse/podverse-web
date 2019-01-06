import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import UserListCtrl from '~/components/UserListCtrl/UserListCtrl'
import { pageIsLoading } from '~/redux/actions'
import { getPublicUsersByQuery } from '~/services'

type Props = {
  listItems?: any
  queryPage: number
}

type State = {}

class PublicProfiles extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const state = store.getState()
    const { user } = state

    query.userIds = user.subscribedUserIds

    const response = await getPublicUsersByQuery({ userIds: user.subscribedUserIds })
    const listItems = response.data

    store.dispatch(pageIsLoading(false))

    const { from: queryFrom, sort: querySort, type: queryType } = query
    return { listItems, query, queryFrom, querySort, queryType, user }
  }

  render() {
    const { listItems, queryPage } = this.props

    return (
      <Fragment>
        <h3>Profiles</h3>
        <UserListCtrl
          listItems={listItems}
          queryPage={queryPage} />
      </Fragment>
    )
  }

}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PublicProfiles)

import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'

type Props = {
  page?: any
}

type State = {}

class PageLoadingOverlay extends Component<Props, State> {
  
  render () {
    const { page } = this.props
    const { isLoading } = page

    return (
      <div className={`page-loading-overlay ${isLoading ? 'show' : ''}`}>
        <FontAwesomeIcon icon='spinner' spin />
      </div> 
    )
  }
  
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect<{}, {}, Props>(mapStateToProps, mapDispatchToProps)(PageLoadingOverlay)

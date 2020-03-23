import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import '~/lib/constants/misc'
import { pageIsLoading } from '~/redux/actions'
import '~/scss/styles.scss'

type Props = {
  statusCode?: number
}

type State = {}

class ErrorPage extends Component<Props, State> {

  static getInitialProps({ res, err, store }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    store.dispatch(pageIsLoading(false))
    return { statusCode }
  }

  render () {
    const { statusCode } = this.props
    let error = statusCode && errors[statusCode]
    if (!error) error = errors.defaultError

    return (
      <div className='full-centered-content-view'>
        {
          error.header &&
            <h3>{error.header}</h3>
        }
        {
          error.icon &&
            <div className='error-icon'>
              <FontAwesomeIcon icon={error.icon} />
            </div>
        }
        {
          error.message1 &&
            <p>{error.message1}</p>
        }
        {
          error.message2 &&
            <p>{error.message2}</p>
        }
      </div>
    )
  }

}

const errors = {
  401: {
    header: 'Login Needed',
    message1: 'You must login to use this feature.'
  },
  404: {
    header: '404 Error',
    message1: 'Page not found'
  },
  500: {
    header: 'Servers under maintenance',
    message1: 'The site will be offline until the work is complete.',
    icon: 'tools'
  },
  defaultError: {
    header: 'Something went wrong',
    message1: 'We\'re not sure what happened there :(',
    message2: 'Check your internet connection, or try a different page.'
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ErrorPage)

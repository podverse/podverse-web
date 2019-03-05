import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Link from 'next/link'
import Switch from 'react-switch'
import { pageIsLoading, pagesSetQueryState, settingsSetNSFWMode, settingsSetUITheme
  } from '~/redux/actions'
import colors from '~/lib/constants/colors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NSFWModal } from '../NSFWModal/NSFWModal'
const cookie = require('cookie')

type Props = {
  pageIsLoading?: any
  pageKey?: string
  settings: any
  settingsSetNSFWMode: any
  settingsSetUITheme: any
}

type State = {
  nsfwModalIsOpen?: boolean
}

class Footer extends Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {}
  }
  
  handleUIThemeChange = checked => {
    const { settingsSetUITheme } = this.props
    const uiTheme = checked ? 'dark' : 'light'

    settingsSetUITheme(uiTheme)

    const expires = new Date()
    expires.setDate(expires.getDate() + 365)
    const uiThemeCookie = cookie.serialize('uiTheme', uiTheme, {
      expires,
      path: '/'
    })
    document.cookie = uiThemeCookie

    const html = document.querySelector('html')
    if (html) {
      html.setAttribute('theme', uiTheme)
    }
  }

  handleNSFWModeChange = checked => {
    const { settingsSetNSFWMode } = this.props
    const nsfwMode = checked ? 'on' : 'off'

    settingsSetNSFWMode(nsfwMode)

    const expires = new Date()
    expires.setDate(expires.getDate() + 365)
    const nsfwModeCookie = cookie.serialize('nsfwMode', nsfwMode, {
      expires,
      path: '/'
    })
    document.cookie = nsfwModeCookie

    this.setState({ nsfwModalIsOpen: true })
  }

  hideNSFWModal = () => {
    this.setState({ nsfwModalIsOpen: false })
  }

  linkClick = () => {
    const { pageIsLoading, pageKey, pagesSetQueryState } = this.props
    pageIsLoading(true)

    const scrollPos = document.querySelector('.view__contents').scrollTop
    pagesSetQueryState({
      pageKey,
      lastScrollPosition: scrollPos
    })
  }

  render() {
    const { settings } = this.props
    const { nsfwMode, nsfwModeHide, uiTheme, uiThemeHide } = settings
    const { nsfwModalIsOpen } = this.state

    const uiThemeAriaLabel = uiTheme === 'dark' || !uiTheme ? 'Turn on light mode' : 'Turn on dark mode'
    const nsfwModeAriaLabel = nsfwMode ? 'Turn off NSFW content' : 'Turn on NSFW content'

    return (
      <React.Fragment>
        <div className='footer'>
          <div className='footer__top'>
            <Link
              as='/'
              href='/'>
              <a
                className='footer-top__brand'
                onClick={this.linkClick}>
                Podverse<sup>FM</sup>
              </a>
            </Link>
            {
              uiThemeHide !== 'true' &&
                <div className='footer-top__ui-theme'>
                  <span className='footer-top-ui-theme__left'>
                    <FontAwesomeIcon icon='sun' />&nbsp;
                  </span>
                  <Switch
                    aria-label={uiThemeAriaLabel}
                    checked={!uiTheme || uiTheme === 'dark'}
                    checkedIcon
                    height={24}
                    id="ui-theme-switch"
                    offColor={colors.grayLighter}
                    onColor={colors.grayDarker}
                    onChange={this.handleUIThemeChange}
                    uncheckedIcon
                    width={40} />
                  <span className='footer-top-ui-theme__right'>
                    &nbsp;<FontAwesomeIcon icon='moon' />
                  </span>
                </div>
            }
            {
              nsfwModeHide !== 'true' &&
                <div className='footer-top__nsfw'>
                  <span className='footer-top-nsfw__left'>SFW&nbsp;</span>
                  <Switch
                    aria-label={nsfwModeAriaLabel}
                    checked={!nsfwMode || nsfwMode === 'on'}
                    checkedIcon
                    height={24}
                    offColor={colors.blue}
                    onChange={this.handleNSFWModeChange}
                    onColor={colors.redDarker}
                    uncheckedIcon
                    width={40} />
                  <span className='footer-top-nsfw__right'>&nbsp;NSFW</span>
                </div>
            }
            <Link
              as='https://www.gnu.org/licenses/agpl-3.0.en.html'
              href='https://www.gnu.org/licenses/agpl-3.0.en.html'>
              <a 
                className='footer-top__license'
                target='_blank'>
                <span className='flip-text-horizontal'>&copy;</span>
                <span className='hide-tiny'> copyleft</span>
              </a>
            </Link>
          </div>
          <div className='footer__bottom'>
            <Link
              as='https://goo.gl/forms/BK9WPAsK1q6xD4Xw1'
              href='https://goo.gl/forms/BK9WPAsK1q6xD4Xw1'>
              <a 
                className='footer-bottom__link'
                target='_blank'>
                Contact
              </a>
            </Link>
            <Link
              as='/faq'
              href='/faq'>
              <a
                className='footer-bottom__link'
                onClick={this.linkClick}>
                FAQ
              </a>
            </Link>
            <Link
              as='/about'
              href='/about'>
              <a
                className='footer-bottom__link'
                onClick={this.linkClick}>
                About
              </a>
            </Link>
            <Link
              as='/terms'
              href='/terms'>
              <a
                className='footer-bottom__link'
                onClick={this.linkClick}>
                Terms
              </a>
            </Link>
          </div>
        </div>
        <NSFWModal
          handleHideModal={this.hideNSFWModal}
          isNSFWModeOn={nsfwMode === 'on'}
          isOpen={nsfwModalIsOpen} />
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pageIsLoading: bindActionCreators(pageIsLoading, dispatch),
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch),
  settingsSetNSFWMode: bindActionCreators(settingsSetNSFWMode, dispatch),
  settingsSetUITheme: bindActionCreators(settingsSetUITheme, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Footer)

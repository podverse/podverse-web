import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faGithub, faRedditAlien, faTwitter } from '@fortawesome/free-brands-svg-icons'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Link from 'next/link'
import Switch from 'react-switch'
import config from '~/config'
import colors from '~/lib/constants/colors'
import { constants } from '~/lib/constants/misc'
import { getViewContentsElementScrollTop } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState, settingsSetNSFWMode, settingsSetUITheme
  } from '~/redux/actions'
const cookie = require('cookie')
const { CONTACT_FORM_URL, SOCIAL_FACEBOOK_PAGE_URL, SOCIAL_GITHUB_PAGE_URL,
  SOCIAL_REDDIT_PAGE_URL, SOCIAL_TWITTER_PAGE_URL } = config()

type Props = {
  isMobileDevice?: boolean
  pageIsLoading?: any
  pageKey?: string
  pagesSetQueryState?: any
  settings: any
  settingsSetNSFWMode: any
  settingsSetUITheme: any
  user: any
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
      html.setAttribute('data-theme', uiTheme)
      // use .is-switching-ui-mode to prevent ugly transition effects
      html.setAttribute('is-switching-ui-mode', 'true')
      setTimeout(() => {
        html.setAttribute('is-switching-ui-mode', '')
      }, 1000)
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

    const scrollPos = getViewContentsElementScrollTop()
    pagesSetQueryState({
      pageKey,
      lastScrollPosition: scrollPos
    })
  }

  render() {
    const { settings } = this.props
    const { uiTheme, uiThemeHide } = settings

    const uiThemeAriaLabel = uiTheme === 'dark' || !uiTheme ? 'Turn on light mode' : 'Turn on dark mode'

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
                Podverse
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
            {/* {
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
            } */}
            <Link
              as='https://www.gnu.org/licenses/agpl-3.0.en.html'
              href='https://www.gnu.org/licenses/agpl-3.0.en.html'>
              <a 
                className='footer-top__license'
                target='_blank'>
                <span className='hide-tiny'>open source </span>
                <span className='flip-text-horizontal'>&copy;</span>
              </a>
            </Link>
          </div>
          <div className='footer__bottom'>
            <div className='footer-bottom__site-links'>
              <Link
                as={CONTACT_FORM_URL}
                href={CONTACT_FORM_URL || ''}>
                <a 
                  className='footer-bottom__link'
                  target='_blank'>
                  Contact
                </a>
              </Link>
              {/* <Link
                as='/faq'
                href='/faq'>
                <a
                  className='footer-bottom__link'
                  onClick={this.linkClick}>
                  FAQ
                </a>
              </Link> */}
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
                as='/membership'
                href='/membership'>
                <a
                  className='footer-bottom__link'
                  onClick={this.linkClick}>
                  {constants.core.Premium}
                </a>
              </Link>
            </div>
            <div className='footer-bottom__social-links'>
              {
                SOCIAL_GITHUB_PAGE_URL &&
                  <Link
                    as={SOCIAL_GITHUB_PAGE_URL}
                    href={SOCIAL_GITHUB_PAGE_URL}>
                    <a
                      className='footer-bottom__social-link'
                      target='_blank'>
                      <FontAwesomeIcon icon={faGithub} />
                    </a>
                  </Link>
              }
              {
                SOCIAL_TWITTER_PAGE_URL &&
                  <Link
                    as={SOCIAL_TWITTER_PAGE_URL}
                    href={SOCIAL_TWITTER_PAGE_URL}>
                    <a
                      className='footer-bottom__social-link'
                      target='_blank'>
                      <FontAwesomeIcon icon={faTwitter} />
                    </a>
                  </Link>
              }
              {
                SOCIAL_FACEBOOK_PAGE_URL &&
                  <Link
                    as={SOCIAL_FACEBOOK_PAGE_URL}
                    href={SOCIAL_FACEBOOK_PAGE_URL}>
                    <a
                      className='footer-bottom__social-link'
                      target='_blank'>
                      <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                  </Link>
              }
              {
                SOCIAL_REDDIT_PAGE_URL &&
                  <Link
                    as={SOCIAL_REDDIT_PAGE_URL}
                    href={SOCIAL_REDDIT_PAGE_URL}>
                    <a
                      className='footer-bottom__social-link'
                      target='_blank'>
                      <FontAwesomeIcon icon={faRedditAlien} />
                    </a>
                  </Link>
              }
            </div>
          </div>
        </div>
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

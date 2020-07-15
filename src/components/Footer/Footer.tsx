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
    const uiTheme = checked ? constants.attributes.dark : constants.attributes.light

    settingsSetUITheme(uiTheme)

    const expires = new Date()
    expires.setDate(expires.getDate() + 365)
    const uiThemeCookie = cookie.serialize(constants.cookies.uiTheme, uiTheme, {
      expires,
      path: constants.paths.home
    })
    document.cookie = uiThemeCookie

    const html = document.querySelector('html')
    if (html) {
      html.setAttribute(constants.attributes.data_theme, uiTheme)
      // use .is-switching-ui-mode to prevent ugly transition effects
      html.setAttribute(constants.attributes.is_switching_ui_mode, 'true')
      setTimeout(() => {
        html.setAttribute(constants.attributes.is_switching_ui_mode, '')
      }, 1000)
    }
  }

  handleNSFWModeChange = checked => {
    const { settingsSetNSFWMode } = this.props
    const nsfwMode = checked ? 'on' : 'off'

    settingsSetNSFWMode(nsfwMode)

    const expires = new Date()
    expires.setDate(expires.getDate() + 365)
    const nsfwModeCookie = cookie.serialize(constants.attributes.nsfwMode, nsfwMode, {
      expires,
      path: constants.paths.home
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

    const uiThemeAriaLabel = uiTheme === constants.attributes.dark || !uiTheme ? constants.core.TurnOnLight : constants.core.TurnOnDark

    return (
      <React.Fragment>
        <div className='footer'>
          <div className='footer__top'>
            <Link
              as={constants.paths.home}
              href={constants.paths.home}>
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
                    <FontAwesomeIcon icon={constants.icons.sun} />&nbsp;
                  </span>
                  <Switch
                    aria-label={uiThemeAriaLabel}
                    checked={!uiTheme || uiTheme === constants.attributes.dark}
                    checkedIcon
                    height={24}
                    id="ui-theme-switch"
                    offColor={colors.grayLighter}
                    onColor={colors.grayDarker}
                    onChange={this.handleUIThemeChange}
                    uncheckedIcon
                    width={40} />
                  <span className='footer-top-ui-theme__right'>
                    &nbsp;<FontAwesomeIcon icon={constants.icons.moon} />
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
              as={constants.paths.license}
              href={constants.paths.license}>
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
                as={constants.paths.about}
                href={constants.paths.about}>
                <a
                  className='footer-bottom__link'
                  onClick={this.linkClick}>
                  About
                </a>
              </Link>
              <Link
                as={constants.paths.terms}
                href={constants.paths.terms}>
                <a
                  className='footer-bottom__link'
                  onClick={this.linkClick}>
                  Terms
                </a>
              </Link>
              <Link
                as={constants.paths.faq}
                href={constants.paths.faq}>
                <a
                  className='footer-bottom__link'
                  onClick={this.linkClick}>
                  FAQ
                </a>
              </Link>
              <Link
                as={constants.paths.membership}
                href={constants.paths.membership}>
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

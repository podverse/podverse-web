import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faGithub, faRedditAlien, faTwitter } from '@fortawesome/free-brands-svg-icons'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Link from 'next/link'
import Switch from 'react-switch'
import config from '~/config'
import PV from '~/lib/constants'
import { getViewContentsElementScrollTop } from '~/lib/utility'
import { pageIsLoading, pagesSetQueryState, settingsSetUITheme
  } from '~/redux/actions'
import { withTranslation } from 'i18n'
const cookie = require('cookie')
const { CONTACT_US_EMAIL, SOCIAL_FACEBOOK_PAGE_URL, SOCIAL_GITHUB_PAGE_URL,
  SOCIAL_REDDIT_PAGE_URL, SOCIAL_TWITTER_PAGE_URL } = config()

type Props = {
  isMobileDevice?: boolean
  pageIsLoading?: any
  pageKey?: string
  pagesSetQueryState?: any
  settings: any
  settingsSetUITheme: any
  t?: any
  user: any
}

type State = {}

class Footer extends Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {}
  }
  
  handleUIThemeChange = checked => {
    const { settingsSetUITheme } = this.props
    const uiTheme = checked ? PV.attributes.dark : PV.attributes.light

    settingsSetUITheme(uiTheme)

    const expires = new Date()
    expires.setDate(expires.getDate() + 365)
    const uiThemeCookie = cookie.serialize(PV.cookies.uiTheme, uiTheme, {
      expires,
      path: PV.paths.web.home
    })
    document.cookie = uiThemeCookie

    const html = document.querySelector('html')
    if (html) {
      html.setAttribute(PV.attributes.data_theme, uiTheme)
      // use .is-switching-ui-mode to prevent ugly transition effects
      html.setAttribute(PV.attributes.is_switching_ui_mode, 'true')
      setTimeout(() => {
        html.setAttribute(PV.attributes.is_switching_ui_mode, '')
      }, 1000)
    }
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
    const { settings, t } = this.props
    const { uiTheme, uiThemeHide } = settings

    const uiThemeAriaLabel = uiTheme === PV.attributes.dark || !uiTheme ? t('TurnOnLight') : t('TurnOnDark')

    return (
      <React.Fragment>
        <div className='footer'>
          <div className='footer__top'>
            <Link
              as={PV.paths.web.home}
              href={PV.paths.web.home}>
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
                    checked={!uiTheme || uiTheme === PV.attributes.dark}
                    checkedIcon
                    height={24}
                    id="ui-theme-switch"
                    offColor={PV.colors.grayLighter}
                    onColor={PV.colors.grayDarker}
                    onChange={this.handleUIThemeChange}
                    uncheckedIcon
                    width={40} />
                  <span className='footer-top-ui-theme__right'>
                    &nbsp;<FontAwesomeIcon icon='moon' />
                  </span>
                </div>
            }
            <Link
              as={PV.paths.web.license}
              href={PV.paths.web.license}>
              <a 
                className='footer-top__license'
                target='_blank'>
                <span className='hide-tiny'>{t('open source')} </span>
                <span className='flip-text-horizontal'>&copy;</span>
              </a>
            </Link>
          </div>
          <div className='footer__bottom'>
            <div className='footer-bottom__site-links'>
              <a 
                className='footer-bottom__link'
                href={`mailto:${CONTACT_US_EMAIL}`}>
                {t('Contact')}
              </a>
              <Link
                as={PV.paths.web.about}
                href={PV.paths.web.about}>
                <a
                  className='footer-bottom__link'
                  onClick={this.linkClick}>
                  {t('About')}
                </a>
              </Link>
              <Link
                as={PV.paths.web.terms}
                href={PV.paths.web.terms}>
                <a
                  className='footer-bottom__link'
                  onClick={this.linkClick}>
                  {t('Terms')}
                </a>
              </Link>
              <Link
                as={PV.paths.web.membership}
                href={PV.paths.web.membership}>
                <a
                  className='footer-bottom__link'
                  onClick={this.linkClick}>
                  {t('Premium')}
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
  settingsSetUITheme: bindActionCreators(settingsSetUITheme, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(PV.nexti18next.namespaces)(Footer))

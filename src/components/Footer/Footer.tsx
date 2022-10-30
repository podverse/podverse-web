import { faDiscord, faGithub, faMastodon, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faCopyright as faCopyrightRegular, faLightbulb } from '@fortawesome/free-regular-svg-icons'
import { useTranslation } from 'react-i18next'
import { PV } from '~/resources'
import { Icon, NavBarBrand, PVLink } from '..'

export const Footer = () => {
  const { t } = useTranslation()

  const socialLinks = (
    <>
      <li>
        <a
          aria-label={t('Social Media - Mastodon')}
          className='footer-social-link-mastodon'
          href='https://podcastindex.social/web/@podverse'
          target='_blank'
          rel='noreferrer'
        >
          <Icon faIcon={faMastodon} />
        </a>
      </li>
      <li>
        <a
          aria-label={t('Social Media - Matrix Org')}
          className='footer-social-link-matrix-org'
          href={PV.Contact.matrixInvite}
          target='_blank'
          rel='noreferrer'
        >
          <Icon customIcon={<i class='fa fa-matrix-org' aria-hidden='true'></i>} />
        </a>
      </li>
      <li>
        <PVLink ariaLabel={t('Social Media - XMPP')} className='footer-social-link-xmpp' href='/xmpp'>
          <Icon customIcon={<i class='fa fa-xmpp' aria-hidden='true'></i>} />
        </PVLink>
      </li>
      <li>
        <a
          aria-label={t('Social Media - Discord')}
          className='footer-social-link-discord'
          href={PV.Contact.discordInvite}
          target='_blank'
          rel='noreferrer'
        >
          <Icon faIcon={faDiscord} />
        </a>
      </li>
      <li>
        <a
          aria-label={t('Social Media - Twitter')}
          className='footer-social-link-twitter'
          href={PV.Contact.twitter}
          target='_blank'
          rel='noreferrer'
        >
          <Icon faIcon={faTwitter} />
        </a>
      </li>
      <li>
        <a
          aria-label={t('Social Media - GitHub')}
          className='footer-social-link-github'
          href='https://github.com/podverse'
          target='_blank'
          rel='noreferrer'
        >
          <Icon faIcon={faGithub} />
        </a>
      </li>
    </>
  )

  return (
    <footer className='footer'>
      <hr aria-hidden='true' />
      <div className='footer-top'>
        <NavBarBrand height={28} href={PV.RoutePaths.web.home} width={150} />
        <div className='open-source-license'>
          <a href='https://www.gnu.org/licenses/agpl-3.0.en.html' target='_blank' rel='noreferrer'>
            {t('open source')} <Icon faIcon={faCopyrightRegular} rotation={180} />
          </a>
        </div>
      </div>
      <div className='footer-middle'>
        <div className='footer-middle-site-links'>
          <ul aria-label={t('Footer links')}>
            <li>
              <PVLink className='footer-link-contact' href='/contact'>
                {t('Contact')}
              </PVLink>
            </li>
            <li>
              <PVLink className='footer-link-about' href='/about'>
                {t('About')}
              </PVLink>
            </li>
            <li>
              <PVLink className='footer-link-terms' href='/terms'>
                {t('Terms')}
              </PVLink>
            </li>
            <li>
              <PVLink className='footer-link-premium' href='/membership'>
                {t('Premium')}
              </PVLink>
            </li>
          </ul>
          <ul aria-label={t('Social media links')} className='footer-right-section hide-below-tablet-max-width'>
            {socialLinks}
          </ul>
        </div>
        <div className='footer-middle-site-links'>
          <ul aria-label={t('Footer links continued')}>
            <li>
              <PVLink className='footer-link-mobile-app' href='/about'>
                {t('Mobile App')}
              </PVLink>
            </li>
            <li>
              <PVLink className='footer-link-tutorials' href='/tutorials'>
                {t('Tutorials')}
              </PVLink>
            </li>
            <li>
              <PVLink className='footer-link-mobile-app' href={PV.RoutePaths.web.embed.player_demo}>
                {t('Embed')}
              </PVLink>
            </li>
            {/* <li>
              <PVLink href='/v4v-wallet'>V4V Wallet</PVLink>
            </li> */}
            <li>
              <PVLink className='footer-link-contribute' href='/contribute'>
                {t('Contribute')}
              </PVLink>
            </li>
          </ul>
          {/* <ul className='footer-right-section hide-below-tablet-max-width'>
            <li>
              <i className="pi pi-podcasting20certified"></i>
            </li>
          </ul> */}
        </div>
        <ul className='footer-mobile-section hide-above-tablet-xl-min-width'>{socialLinks}</ul>
        {/* <ul className='footer-mobile-section hide-above-tablet-xl-min-width'>
          <li>
            <i className="pi pi-podcasting20certified"></i>
          </li>
        </ul> */}
      </div>
    </footer>
  )
}

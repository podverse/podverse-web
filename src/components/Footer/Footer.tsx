import { faCopyright as faCopyrightRegular } from '@fortawesome/free-regular-svg-icons'
import { PV } from '~/resources'
import { Icon, NavBarBrand } from ".."

export const Footer = () => {
    return (
      <footer className='footer'>
        <hr />
        <div className='footer-top'>
          <NavBarBrand height={28} href={PV.RoutePaths.web.home} src={PV.Images.dark.brandLogo} width={150} />
          <div className='open-source-license'>
            <a href='https://www.gnu.org/licenses/agpl-3.0.en.html' target='_blank'>
              open source <Icon faIcon={faCopyrightRegular} rotation={180} />
            </a>
          </div>
        </div>
        <div className="footer-middle">
          <div className="footer-middle-site-links">
              <ul>
                  <li>
                      <a href="/contact">Contact</a>
                  </li>
                  <li>
                      <a href="/about">About</a>
                  </li>
                  <li>
                    <a href="/terms">Terms</a>
                  </li>
                  <li>
                    <a href="/membership">Premium</a>
                  </li>
              </ul>
          </div>
          <div className="footer-middle-site-links">
            <ul>
              <li>
                <a href="/mobile-app">Mobile App</a>
              </li>
              <li>
                <a href="/v4v-wallet">V4V Wallet</a>
              </li>
              <li>
                <a href="/donate">Donate</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    )
  }
  
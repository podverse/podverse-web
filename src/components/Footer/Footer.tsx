import React, { StatelessComponent } from 'react'
import Link from 'next/link'

type Props = {}

const Footer: StatelessComponent<Props> = props => {
  
  return (
    <div className='footer'>
      <div className='footer__top'>
        <Link
          as='/'
          href='/'>
          <a className='footer-top__brand'>
            Podverse<sup>FM</sup>
          </a>
        </Link>
        <Link
          as='https://www.gnu.org/licenses/agpl-3.0.en.html'
          href='https://www.gnu.org/licenses/agpl-3.0.en.html'>
          <a 
            className='footer-top__license'
            target='_blank'>
            <span className='flip-text-horizontal'>&copy;</span> AGPLv3
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
          <a className='footer-bottom__link'>
            FAQ
          </a>
        </Link>
        <Link
          as='/about'
          href='/about'>
          <a className='footer-bottom__link'>
            About
          </a>
        </Link>
        <Link
          as='/terms'
          href='/terms'>
          <a className='footer-bottom__link'>
            Terms
          </a>
        </Link>
        <Link
          as='/dev'
          href='/dev'>
          <a className='footer-bottom__link'>
            Dev
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Footer

import React, { Fragment } from 'react'
import Link from 'next/link'
import Meta from '~/components/meta'
import { MediaListSelect } from 'podverse-ui'

export default () => (
  <Fragment>
    <Meta />
    <h1>Podverse</h1>
    <h2>main</h2>
    <MediaListSelect />
    <ul>
      <li><Link href='/clip' as='/clip'><a>clip</a></Link></li>
      <li><Link href='/clips' as='/clips'><a>clips</a></Link></li>
      <li><Link href='/episode' as='/episode'><a>episode</a></Link></li>
      <li><Link href='/playlist' as='/playlist'><a>playlist</a></Link></li>
      <li><Link href='/playlists' as='/playlists'><a>playlists</a></Link></li>
      <li><Link href='/podcast' as='/podcast'><a>podcast</a></Link></li>
      <li><Link href='/podcasts' as='/podcasts'><a>podcasts</a></Link></li>
    </ul>
    <h2>auth</h2>
    <ul>
      <li><Link href='/forgot-password' as='/forgot-password'><a>forgot password</a></Link></li>
      <li><Link href='/login' as='/login'><a>login</a></Link></li>
      <li><Link href='/resetPassword' as='/resetPassword'><a>reset password</a></Link></li>
      <li><Link href='/signup' as='/signup'><a>sign up</a></Link></li>
    </ul>
    <h2>info</h2>
    <ul>
      <li><Link href='/about' as='/about'><a>about</a></Link></li>
      <li><Link href='/contact' as='/contact'><a>contact</a></Link></li>
      <li><Link href='/faq' as='/faq'><a>faq</a></Link></li>
      <li><Link href='/terms' as='/terms'><a>terms</a></Link></li>
    </ul>
    <h2>admin</h2>
    <ul>
      <li><Link href='/admin' as='/admin'><a>admin</a></Link></li>
    </ul>
    <h2>dev</h2>
    <ul>
      <li><Link href='/dev' as='/dev'><a>dev</a></Link></li>
    </ul>
  </Fragment>
)

import React, { Fragment } from 'react'
import Link from 'next/link'
import Meta from '~/components/meta'

export default () => (
  <Fragment>
    <ul>
      <Meta />
      <li><Link href='/clip' as='/clip'><a>clip</a></Link></li>
      <li><Link href='/clips' as='/clips'><a>clips</a></Link></li>
      <li><Link href='/episode' as='/episode'><a>episode</a></Link></li>
      <li><Link href='/playlist' as='/playlist'><a>playlist</a></Link></li>
      <li><Link href='/playlists' as='/playlists'><a>playlists</a></Link></li>
      <li><Link href='/podcast' as='/podcast'><a>podcast</a></Link></li>
      <li><Link href='/podcasts' as='/podcasts'><a>podcasts</a></Link></li>
    </ul>
  </Fragment>
)

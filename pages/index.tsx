import React, { Fragment } from 'react'
import Link from 'next/link'
import Meta from '../components/meta'

export default () => (
  <Fragment>
    <ul>
      <li><Link href='/a' as='/a'><a>a</a></Link></li>
      <li><Link href='/b' as='/b'><a>b</a></Link></li>
    </ul>
  </Fragment>
)

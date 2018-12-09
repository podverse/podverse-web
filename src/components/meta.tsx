import { Fragment } from 'react'
import Head from 'next/head'
import '~/scss/styles.scss'
import '~/lib/constants/misc'

export default () => (
  <Fragment>
    <Head>
      <title>Podverse</title>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta charSet='utf-8' />
    </Head>
  </Fragment>
)
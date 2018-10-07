import React, { Fragment } from 'react'
import { Button } from 'podverse-ui'
import Meta from '~/components/meta'

export default () => {

  return (
    <Fragment>
      <Meta />
      <Button label='reset password' />
    </Fragment>
  )
}
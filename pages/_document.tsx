import React from 'react'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import PV from '~/lib/constants'
import { actionTypes } from '~/redux/constants'
const cookie = require('cookie')

type Props = {
  initialUITheme?: string
}

export default class MyDocument extends Document<Props> {

  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)

    let initialUITheme = PV.attributes.dark

    if (ctx.req.headers.cookie) {
      const parsedCookie = cookie.parse(ctx.req.headers.cookie)
      initialUITheme = parsedCookie.uiTheme ? parsedCookie.uiTheme : PV.attributes.dark
    }

    ctx.store.dispatch({
      type: actionTypes.SETTINGS_SET_UI_THEME,
      payload: initialUITheme
    })

    return { ...initialProps, initialUITheme }
  }

  render() {
    const { initialUITheme } = this.props

    return (
      <Html lang='en' data-theme={initialUITheme}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
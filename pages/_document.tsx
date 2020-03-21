import React from 'react'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import { actionTypes } from '~/redux/constants'
import '~/scss/styles.scss'
const cookie = require('cookie')

type Props = {
  initialUITheme?: string
}

export default class MyDocument extends Document<Props> {

  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)

    let initialUITheme = 'dark'

    if (ctx.req.headers.cookie) {
      const parsedCookie = cookie.parse(ctx.req.headers.cookie)
      initialUITheme = parsedCookie.uiTheme ? parsedCookie.uiTheme : 'dark'
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
import Document, { Head, Main, NextScript } from 'next/document'

export default class CustomDocument extends Document {
  render () {
    return (
      // @ts-ignore
      <html theme="dark">
        <body>
          <Head />
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

import Document, { Head, Main, NextScript } from 'next/document'

export default class CustomDocument extends Document {
  render () {
    return (
      <html theme="light">
        <body>
          <Head />
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

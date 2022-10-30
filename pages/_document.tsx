import classnames from 'classnames'
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    const pageProps = this.props?.__NEXT_DATA__?.props?.pageProps
    const appWrapperClasses = classnames(
      'app-wrapper',
      pageProps?.serverCookies?.lightMode ? 'theme-light' : 'theme-dark'
    )

    return (
      <Html className={appWrapperClasses}>
        <Head>
          <link rel='preload' href='/fonts/Roboto/Roboto-Regular.ttf' as='font' crossOrigin='' />
          <link rel='preload' href='/fonts/Roboto/Roboto-Italic.ttf' as='font' crossOrigin='' />
          <link rel='preload' href='/fonts/Roboto/Roboto-Bold.ttf' as='font' crossOrigin='' />
          <link rel='stylesheet' type='text/css' media='screen' href='https://cdn.conversejs.org/dist/converse.css' />
          <link
            rel='stylesheet'
            href='https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css'
            integrity='sha256-XoaMnoYC5TH6/+ihMEnospgm0J1PM/nioxbOUdnM8HY='
            crossOrigin='anonymous'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

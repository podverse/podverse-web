import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html className='theme-dark'>
        <Head>
          <link
            rel="preload"
            href="/fonts/Roboto/Roboto-Regular.ttf"
            as="font"
            crossOrigin="" />
          <link
            rel="preload"
            href="/fonts/Roboto/Roboto-Italic.ttf"
            as="font"
            crossOrigin="" />
          <link
            rel="preload"
            href="/fonts/Roboto/Roboto-Bold.ttf"
            as="font"
            crossOrigin="" />
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

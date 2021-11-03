import '../styles/globals.scss'
import { appWithTranslation } from 'next-i18next'
import { NavBar } from '~/components'

function MyApp({ Component, pageProps }) {
  return (
    <body className='theme-dark'>
      <NavBar />
      <Component {...pageProps} />
    </body>
  )
}

export default appWithTranslation(MyApp)

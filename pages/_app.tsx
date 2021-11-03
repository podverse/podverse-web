import '../styles/globals.scss'
import { appWithTranslation } from 'next-i18next'
import { NavBar } from '~/components'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NavBar />
      <Component {...pageProps} />
    </>
  )
}

export default appWithTranslation(MyApp)

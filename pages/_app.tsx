import '../styles/index.scss'
import { appWithTranslation } from 'next-i18next'
import { NavBar } from '~/components'

function MyApp({ Component, pageProps }) {
  return (
    <div className='app-wrapper'>
      <NavBar />
      <main>
        <Component {...pageProps} />
      </main>
    </div>
  )
}

export default appWithTranslation(MyApp)

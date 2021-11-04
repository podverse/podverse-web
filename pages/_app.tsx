import '../styles/index.scss'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core'
import { appWithTranslation } from 'next-i18next'
import { NavBar } from '~/components'

fontAwesomeConfig.autoAddCss = false

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

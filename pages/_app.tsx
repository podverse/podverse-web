import '../styles/index.scss'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core'
import { appWithTranslation } from 'next-i18next'
import { NavBar, NavBarSecondary } from '~/components'

fontAwesomeConfig.autoAddCss = false

function MyApp({ Component, pageProps }) {
  const { t } = pageProps
  
  return (
    <div className='app-wrapper'>
      <NavBar />
      <div className='app-main-wrapper'>
        <NavBarSecondary />
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </div>
  )
}

export default appWithTranslation(MyApp)

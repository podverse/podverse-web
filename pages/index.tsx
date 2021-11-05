import Podcasts from "./podcasts"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PV } from '~/resources'

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, PV.i18n.fileNames.all))
    }
  }
}

export default Podcasts

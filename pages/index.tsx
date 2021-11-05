import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Podcasts from './podcasts'
import { PV } from '~/resources'

export default Podcasts

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, locale } = ctx
  const { cookies } = req

  return {
    props: {
      ...(await serverSideTranslations(locale, PV.i18n.fileNames.all)),
      serverSideCookies: cookies
    }
  }
}

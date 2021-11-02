const NextI18Next = require('next-i18next').default
const { localeSubpaths } = require('next/config').default().publicRuntimeConfig
const path = require('path')

const nextI18Next = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['es', 'lt'],
  localeSubpaths,
  localePath: path.resolve('./public/static/locales'),
  defaultNS: 'common'
})

export default nextI18Next
export const appWithTranslation = nextI18Next.appWithTranslation
export const i18n = nextI18Next.i18n
export const withTranslation = nextI18Next.withTranslation
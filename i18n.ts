const NextI18Next = require('next-i18next').default
const { localeSubpaths } = require('next/config').default().publicRuntimeConfig
const path = require('path')

const i18n = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['es'],
  localeSubpaths,
  localePath: path.resolve('./src/public/static/locales'),
  defaultNS: []
})

export default i18n
export const appWithTranslation = i18n.appWithTranslation
export const withTranslation = i18n.withTranslation

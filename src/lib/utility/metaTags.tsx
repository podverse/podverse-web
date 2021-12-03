import striptags from 'striptags'

// Remove nonAlphanumeric characters that are not supported by search crawlers
const seoRemoveNonAlphanumericCharacters = (str) => str.replace(/[^0-9a-z-_–:,'’"?!.%\s]/gi, '')

// Titles are limited to ~60 characters by Google
export const seoMetaTitle = (str) => {
  str = striptags(str)
  return seoRemoveNonAlphanumericCharacters(str)
}

// Titles are limited to ~160 characters by Google
export const seoMetaDescription = (str) => {
  str = striptags(str)
  return seoRemoveNonAlphanumericCharacters(str)
}

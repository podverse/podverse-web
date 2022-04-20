import striptags from 'striptags'

// Remove nonAlphanumeric characters that are not supported by search crawlers
// NOTE: I'm disabling this because I don't know if it has any benefit, and
// it leads to titles and descriptions rendering with characters missing.
// const seoRemoveNonAlphanumericCharacters = (str) => str.replace(/[^0-9a-z-_–:,'’"?!.%\s]/gi, '')

// Titles are limited to ~60 characters by Google
export const seoMetaTitle = (str) => {
  str = striptags(str)
  // str = seoRemoveNonAlphanumericCharacters(str)
  return str
}

// Titles are limited to ~160 characters by Google
export const seoMetaDescription = (str) => {
  str = striptags(str)
  // str = seoRemoveNonAlphanumericCharacters(str)
  return str
}

// Remember to update src/lib/utility/date.ts as well
const defaultLang = 'en'
const enabledLangs = [
  'da', 'de', 'el', 'es', 'fr', 'lt', 'nb',
  'pt', 'pt-br', 'ru', 'sv', 'tr'
]
let enabledLang = defaultLang

if (typeof navigator !== 'undefined') {
  if (navigator.languages != undefined) {
    if (enabledLangs.some(x => x === navigator.languages[0]?.toLowerCase())) {
      enabledLang = navigator.languages[0]
    } else if (enabledLangs.some(x => x === navigator.language?.toLowerCase())) {
      enabledLang = navigator.language
    }
  } else {
    enabledLang = defaultLang
  }
}

export const currentLocale = enabledLang

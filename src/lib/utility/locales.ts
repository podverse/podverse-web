export function getLang() {
  if (typeof navigator !== 'undefined') {
    if (navigator.languages != undefined) return navigator.languages[0]
    return navigator.language
  } else {
    return 'en'
  }
}

export const convertObjectToQueryString = (obj) => {
  if (!obj) {
    return ''
  } else {
    return Object.keys(obj)
      .map((key) => key + '=' + obj[key])
      .join('&')
  }
}

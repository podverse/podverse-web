/*
  TODO: env vars are being hardcoded because of an issue where env vars
  are not getting passed to the client-side in Docker containers :(
  
  Any help implementing a good solution for this so we don't have to
  hardcode values and can use a .env instead would be greatly appreciated.

  More info: https://github.com/vercel/next.js/discussions/17641
*/
const API_PROTOCOL = 'http'
const API_DOMAIN = 'localhost:1234'
const API_PATH = 'api'
const API_VERSION = 'v1'
const API_BASE_URL = `${API_PROTOCOL}://${API_DOMAIN}/${API_PATH}/${API_VERSION}`

export const Config = {
  API_BASE_URL,
  QUERY_RESULTS_LIMIT_DEFAULT: 20
}

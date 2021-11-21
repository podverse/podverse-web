import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const API_PROTOCOL = publicRuntimeConfig.NEXT_PUBLIC_API_PROTOCOL
const API_DOMAIN = publicRuntimeConfig.NEXT_PUBLIC_API_DOMAIN
const API_PATH = publicRuntimeConfig.NEXT_PUBLIC_API_PATH
const API_VERSION = publicRuntimeConfig.NEXT_PUBLIC_API_VERSION
const API_BASE_URL = `${API_PROTOCOL}://${API_DOMAIN}/${API_PATH}/${API_VERSION}`

export const Config = {
  API_BASE_URL,
  QUERY_RESULTS_LIMIT_DEFAULT: 20
}

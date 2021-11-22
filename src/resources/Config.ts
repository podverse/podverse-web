import getConfig from 'next/config'
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()

const getServerOrPublicVariable = (envVarKey: string) =>
  serverRuntimeConfig[envVarKey] || publicRuntimeConfig[envVarKey]

const API_PROTOCOL = getServerOrPublicVariable('API_PROTOCOL')
const API_DOMAIN = getServerOrPublicVariable('API_DOMAIN')
const API_PATH = getServerOrPublicVariable('API_PATH')
const API_VERSION = getServerOrPublicVariable('API_VERSION')
const API_BASE_URL = `${API_PROTOCOL}://${API_DOMAIN}/${API_PATH}/${API_VERSION}`

export const Config = {
  API_BASE_URL,
  APP_DOWNLOAD_ON_THE_APP_STORE_URL: getServerOrPublicVariable('APP_DOWNLOAD_ON_THE_APP_STORE_URL'),
  APP_GET_IT_ON_GOOGLE_PLAY_URL: getServerOrPublicVariable('APP_GET_IT_ON_GOOGLE_PLAY_URL'),
  APP_GET_IT_ON_FDROID_URL: getServerOrPublicVariable('APP_GET_IT_ON_FDROID_URL'),
  QUERY_RESULTS_LIMIT_DEFAULT: 20
}

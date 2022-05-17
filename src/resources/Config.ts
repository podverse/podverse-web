import getConfig from 'next/config'
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()

const getServerOrPublicVariable = (envVarKey: string) =>
  // optional chaining helps with the test environment
  serverRuntimeConfig?.[envVarKey] || publicRuntimeConfig?.[envVarKey]

const API_PROTOCOL = getServerOrPublicVariable('API_PROTOCOL')
const API_DOMAIN = getServerOrPublicVariable('API_DOMAIN')
const API_PATH = getServerOrPublicVariable('API_PATH')
const API_VERSION = getServerOrPublicVariable('API_VERSION')
const API_BASE_URL = `${API_PROTOCOL}://${API_DOMAIN}/${API_PATH}/${API_VERSION}`

const WEB_PROTOCOL = getServerOrPublicVariable('WEB_PROTOCOL')
const WEB_DOMAIN = getServerOrPublicVariable('WEB_DOMAIN')
const WEB_BASE_URL = `${WEB_PROTOCOL}://${WEB_DOMAIN}`

const APP_DOWNLOAD_ON_THE_APP_STORE_URL = getServerOrPublicVariable('APP_DOWNLOAD_ON_THE_APP_STORE_URL')
const APP_GET_IT_ON_GOOGLE_PLAY_URL = getServerOrPublicVariable('APP_GET_IT_ON_GOOGLE_PLAY_URL')
const APP_GET_IT_ON_FDROID_URL = getServerOrPublicVariable('APP_GET_IT_ON_FDROID_URL')

const PAYPAL_CLIENT = {
  env: getServerOrPublicVariable('PAYPAL_ENV'),
  production: getServerOrPublicVariable('PAYPAL_CLIENT_ID_PRODUCTION'),
  sandbox: getServerOrPublicVariable('PAYPAL_CLIENT_ID_SANDBOX')
}

const EMAIL_CONTACT = getServerOrPublicVariable('EMAIL_CONTACT')

const metaDefaultImageUrl1200x630 = 'https://podverse.fm/images/podverse-logo-1200x630.png'

const MATOMO_BASE_URL = getServerOrPublicVariable('MATOMO_BASE_URL')
const MATOMO_ENDPOINT_PATH = getServerOrPublicVariable('MATOMO_ENDPOINT_PATH')
const MATOMO_SITE_ID = getServerOrPublicVariable('MATOMO_SITE_ID')

const V4V_APP_NAME = getServerOrPublicVariable('V4V_APP_NAME')
const V4V_APP_RECIPIENT_CUSTOM_KEY = getServerOrPublicVariable('V4V_APP_RECIPIENT_CUSTOM_KEY')
const V4V_APP_RECIPIENT_CUSTOM_VALUE = getServerOrPublicVariable('V4V_APP_RECIPIENT_CUSTOM_VALUE')
const V4V_APP_RECIPIENT_LN_ADDRESS = getServerOrPublicVariable('V4V_APP_RECIPIENT_LN_ADDRESS')
const V4V_APP_RECIPIENT_VALUE_DEFAULT = getServerOrPublicVariable('V4V_APP_RECIPIENT_VALUE_DEFAULT')
const V4V_RECIPIENT_VALUE_DEFAULT = getServerOrPublicVariable('V4V_RECIPIENT_VALUE_DEFAULT')

export const Config = {
  API_BASE_URL,
  WEB_BASE_URL,
  APP_DOWNLOAD_ON_THE_APP_STORE_URL,
  APP_GET_IT_ON_GOOGLE_PLAY_URL,
  APP_GET_IT_ON_FDROID_URL,
  QUERY_RESULTS_LIMIT_DEFAULT: 20,
  PAYPAL_CLIENT,
  EMAIL: {
    CONTACT: EMAIL_CONTACT
  },
  metaDefaultImageUrl1200x630,
  MATOMO_BASE_URL,
  MATOMO_ENDPOINT_PATH,
  MATOMO_SITE_ID,
  V4V_APP_NAME,
  V4V_APP_RECIPIENT_CUSTOM_KEY,
  V4V_APP_RECIPIENT_CUSTOM_VALUE,
  V4V_APP_RECIPIENT_LN_ADDRESS,
  V4V_APP_RECIPIENT_VALUE_DEFAULT,
  V4V_RECIPIENT_VALUE_DEFAULT
}

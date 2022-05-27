import { addLightningBoltToString } from 'podverse-shared'

export const webAddLightningBoltToString = (serverCookies: any, str = '') => {
  let acceptedTerms = null
  try {
    acceptedTerms = JSON.parse(serverCookies.weblnV4VSettings).acceptedTerms
  } catch (error) {
    //
  }

  if (acceptedTerms === 'true') {
    return addLightningBoltToString(str)
  } else {
    return str
  }
}

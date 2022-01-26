import { PV } from '~/resources'
const { MATOMO_BASE_URL, MATOMO_ENDPOINT_PATH, MATOMO_SITE_ID } = PV.Config

/**
 * Check whether the user has set the DNT/doNotTrack setting to true in their browser
 * @param {Object} [options]
 * @param {string} [options.window] - alternate window object to check; used to force various DNT settings in browser tests
 * @param {boolean} [options.ignoreDnt] - flag to ignore browser DNT settings and always return false
 * @returns {boolean} whether the DNT setting is true
 * Original code is by Mixpanel: https://github.com/mixpanel/mixpanel-js/blob/45fe840ea97c29c665022a41623d226402f4c81d/src/gdpr-utils.js#L191
 */
function _hasDoNotTrackFlagOn(options?: any) {
  if (options && options.ignoreDnt) {
    return false
  }
  const win = (options && options.window) || window
  const nav = win['navigator'] || {}
  let hasDntOn = false

  const dntIndicators = [
    nav['doNotTrack'], // standard
    nav['msDoNotTrack'],
    win['doNotTrack']
  ]

  dntIndicators.forEach((dntValue) => {
    if ([true, 1, '1', 'yes'].includes(dntValue)) {
      hasDntOn = true
    }
  })

  return hasDntOn
}

export const initializeMatomo = () => {
  if (!_hasDoNotTrackFlagOn() && MATOMO_BASE_URL && MATOMO_ENDPOINT_PATH && MATOMO_SITE_ID) {
    const _paq = (window._paq = window._paq || [])
    ;(function () {
      const u = MATOMO_BASE_URL
      _paq.push(['setTrackerUrl', u + MATOMO_ENDPOINT_PATH])
      _paq.push(['setSiteId', MATOMO_SITE_ID])
      const d = document,
        g = d.createElement('script'),
        s = d.getElementsByTagName('script')[0]
      if (s && s.parentNode) {
        g.type = 'text/javascript'
        g.async = true
        g.src = u + 'matomo.js'
        s.parentNode.insertBefore(g, s)
      }
    })()
  }
}

export const matomoTrackPageView = () => {
  let intervalCount = 0
  const waitForMotomoToLoad = setInterval(() => {
    intervalCount++
    if (_hasDoNotTrackFlagOn() || intervalCount > 30) {
      clearInterval(waitForMotomoToLoad)
    } else if (window.Matomo) {
      clearInterval(waitForMotomoToLoad)
      trackPageView()
    }
  }, 333)

  const trackPageView = () => {
    if (window.Matomo) {
      const tracker = window.Matomo.getTracker()
      if (tracker) {
        tracker.trackPageView()
      }
    }
  }
}

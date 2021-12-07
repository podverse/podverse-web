import { PV } from '~/resources'
const { MATOMO_BASE_URL, MATOMO_ENDPOINT_PATH, MATOMO_SITE_ID } = PV.Config

export const initializeMatomo = () => {
  if (MATOMO_BASE_URL && MATOMO_ENDPOINT_PATH && MATOMO_SITE_ID) {
    const _paq = window._paq = window._paq || [];
    (function () {
      const u = MATOMO_BASE_URL;
      _paq.push(['setTrackerUrl', u + MATOMO_ENDPOINT_PATH]);
      _paq.push(['setSiteId', MATOMO_SITE_ID]);
      const d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
      if (s && s.parentNode) {
        g.type = 'text/javascript'; g.async = true; g.src = u + 'matomo.js'; s.parentNode.insertBefore(g, s);
      }
    })();
  }
}

export const matomoTrackPageView = () => {
  let intervalCount = 0
  const waitForMotomoToLoad = setInterval(() => {
    intervalCount++
    if (window.Matomo) {
      clearInterval(waitForMotomoToLoad)
      trackPageView()
    } else if (intervalCount > 30) {
      clearInterval(waitForMotomoToLoad)
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

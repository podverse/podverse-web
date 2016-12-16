require('../../navbar.js');
require('../../auth.js');

import { sendGoogleAnalyticsPageView,
         sendGoogleAnalyticsEvent } from '../../googleAnalytics.js';


if (showNextButton) {
  $('.pv-pagination-next').on('click', function () {
    sendGoogleAnalyticsEvent('Pagination', 'Next');
    window.location = '/?page=' + (pageIndex + 1);
  });
}

if (pageIndex > 1) {
  $('.pv-pagination-prev').on('click', function () {
    sendGoogleAnalyticsEvent('Pagination', 'Prev');
    window.location = '/?page=' + (pageIndex - 1);
  });
}

sendGoogleAnalyticsPageView();

require('../../navbar.js');
require('../../auth.js');

import { sendGoogleAnalyticsPageView,
         sendGoogleAnalyticsEvent } from '../../googleAnalytics.js';
import { getParameterByName } from '../../utility.js';

let sortParam = getParameterByName('sort');
sortParam = sortParam ? 'sort=' + sortParam + '&' : '';

if (showNextButton) {
  $('.pv-pagination-next').on('click', function () {
    sendGoogleAnalyticsEvent('Pagination', 'Next');
    window.location = '/?' + sortParam + 'page=' + (pageIndex + 1);
  });
}

if (pageIndex > 1) {
  $('.pv-pagination-prev').on('click', function () {
    sendGoogleAnalyticsEvent('Pagination', 'Prev');
    window.location = '/?' + sortParam + 'page=' + (pageIndex - 1);
  });
}

sendGoogleAnalyticsPageView();

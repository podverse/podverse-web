require('../../navbar.js');
require('../../auth.js');

import { sendGoogleAnalyticsPageView,
         sendGoogleAnalyticsEvent } from '../../googleAnalytics.js';
import { getParameterByName } from '../../utility.js';



$('.filter-dropdown .dropdown-item, .sort-by-dropdown .dropdown-item').on('click', function () {
  const query = $(this).data('query');
  const value = $(this).data('value');
  if (query === 'filter') {
    let sortParam = getParameterByName('sort');
    sortParam = sortParam ? '&sort=' + sortParam : '';
    window.location = '/?' + query + '=' + value + sortParam;
  } else if (query === 'sort') {
    let filterParam = getParameterByName('filter');
    filterParam = filterParam ? 'filter=' + filterParam + '&' : '';
    window.location = '/?' + filterParam + query + '=' + value;
  }
});

if (showNextButton) {
  $('.pv-pagination-next').on('click', function () {
    sendGoogleAnalyticsEvent('Pagination', 'Next');
    let filterParam = getParameterByName('filter');
    filterParam = filterParam ? 'filter=' + filterParam + '&' : '';
    let sortParam = getParameterByName('sort');
    sortParam = sortParam ? 'sort=' + sortParam + '&' : '';
    window.location = '/?' + filterParam + sortParam + 'page=' + (pageIndex + 1);
  });
}

if (pageIndex > 1) {
  $('.pv-pagination-prev').on('click', function () {
    sendGoogleAnalyticsEvent('Pagination', 'Prev');
    let filterParam = getParameterByName('filter');
    filterParam = filterParam ? 'filter=' + filterParam + '&' : '';
    let sortParam = getParameterByName('sort');
    sortParam = sortParam ? 'sort=' + sortParam + '&' : '';
    window.location = '/?' + filterParam + sortParam + 'page=' + (pageIndex - 1);
  });
}

sendGoogleAnalyticsPageView();

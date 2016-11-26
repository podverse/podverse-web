require('../../navbar.js');
require('../../auth.js');
require('../../googleAnalytics.js');

import { addPlaylistItemTextTruncation } from '../../playlistHelper.js';

if (showNextButton) {
  $('.pv-pagination-next').on('click', function () {
    window.location = '/?page=' + (pageIndex + 1);
  });
}

if (pageIndex > 1) {
  $('.pv-pagination-prev').on('click', function () {
    window.location = '/?page=' + (pageIndex - 1);
  });
}

addPlaylistItemTextTruncation();

ga('send', 'pageview');

require('../../navbar.js');
require('../../auth.js');

import { sendGoogleAnalyticsPageView,
         sendGoogleAnalyticsEvent } from '../../googleAnalytics.js';

$('img.lazy').lazyload();

sendGoogleAnalyticsPageView();

require('../../navbar.js');
require('../../auth.js');

import { sendGoogleAnalyticsPageView } from '../../googleAnalytics.js';

$('img.lazy').lazyload();

$('#hide-until-truncation-finishes').hide();

sendGoogleAnalyticsPageView();

require('../../navbar.js');
require('../../auth.js');

import { sendGoogleAnalyticsPageView } from '../../googleAnalytics.js';

$('#hide-until-truncation-finishes').hide();

sendGoogleAnalyticsPageView();

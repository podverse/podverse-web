require('../../navbar.js');
require('../../auth.js');

import { sendGoogleAnalyticsPageView } from '../../googleAnalytics.js';

// TODO: this shouldn't be necessary on this page
$('#hide-until-truncation-finishes').hide();

sendGoogleAnalyticsPageView();

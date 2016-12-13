require('../../navbar.js');
require('../../auth.js');

import { sendGoogleAnalyticsPageView,
         sendGoogleAnalyticsEvent } from '../../googleAnalytics.js';

$('#settings-name').val(userName);

$('#settings-name').keydown(function(e){
  if(e.keyCode == 13) {
    e.preventDefault(e);
    updateUserProfile();
  }
});

function updateUserProfile () {
  $.ajax({
    type: 'PATCH',
    url: '/users/' + userId,
    headers: {
      Authorization: $.cookie('idToken')
    },
    data: {
      name: $('#settings-name').val()
    },
    dataType: 'json',
    success: function () {
      location.href = '/';
    },
    error: function (xhr, status, error) {
      // TODO: add more helpful error messaging
      console.log(xhr);
      console.log(status);
      console.log(error);
    }
  });

  sendGoogleAnalyticsEvent('Settings', 'Update User Profile');
}

$('#settings-submit-btn').on('click', () => {
  updateUserProfile();
});

// TODO: this shouldn't be needed on this page
$('#hide-until-truncation-finishes').hide();

sendGoogleAnalyticsPageView();

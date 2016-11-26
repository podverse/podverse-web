require('../../navbar.js');
require('../../auth.js');
require('../../googleAnalyticsGlobal.js');

$('#settings-name').val(userName);

$('#settings-name').keydown(function(e){
  if(e.keyCode == 13) {
    e.preventDefault();
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
}

$('#settings-submit-btn').on('click', () => {
  updateUserProfile();
});

// TODO: this shouldn't be needed on this page
$('#hide-until-truncation-finishes').hide();

ga('send', 'pageview', {
  'dimension1': podcastTitle
});

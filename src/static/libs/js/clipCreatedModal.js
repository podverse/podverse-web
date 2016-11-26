import { copyToClipboard } from './copyToClipboard.js';
import { sendGoogleAnalyticsEvent } from './googleAnalytics.js';

$('#clip-created-modal-nav-btn').on('click', function () {
  clipCreatedNavToClip();
});

$('#clip-created-modal-copy-btn').on('click', function () {
  clipCreatedCopyURL();
});

function clipCreatedCopyURL () {
  copyToClipboard(document.getElementById('clip-created-modal-link'));
  $('#clip-created-modal-copy-btn').html('Copied Link!');
  setTimeout(function () {
    $('#clip-created-modal').modal('hide');
    setTimeout(function () {
      $('#clip-created-modal-copy-btn').html('Copy Clip Link');
    }, 500);
  }, 800);

  sendGoogleAnalyticsEvent('Clip Created Modal', 'Copy URL');
}

function clipCreatedNavToClip () {
  sendGoogleAnalyticsEvent('Clip Created Modal', 'Nav to Clip');
  location.href = $('#clip-created-modal-link').val();
}

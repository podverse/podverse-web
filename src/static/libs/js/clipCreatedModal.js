import { copyToClipboard } from './copyToClipboard.js';
import { sendGoogleAnalyticsEvent } from './googleAnalytics.js';

$('#clip-created-modal-copy-btn').on('click', function () {
  clipCreatedCopyURL();
});

$('#clip-created-modal-add-to-playlist-btn').on('click', function () {
  toggleAddToPlaylistMenu();
});

$('#clip-created-modal-recommend-btn').on('click', function () {
  toggleRecommendMenu();
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

function toggleAddToPlaylistMenu () {
  $('#clip-created-modal-recommend-btn').removeClass('selected');
  $('#clip-created-modal-add-to-playlist-btn').toggleClass('selected');
}

function toggleRecommendMenu () {
  $('#clip-created-modal-add-to-playlist-btn').removeClass('selected');
  $('#clip-created-modal-recommend-btn').toggleClass('selected');
}

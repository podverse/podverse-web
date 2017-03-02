import { copyToClipboard } from './copyToClipboard.js';
import { sendGoogleAnalyticsEvent } from './googleAnalytics.js';
import { scrapeElementsAndAddToPlaylist } from './playlistHelper.js';

function clipCreatedCopyURL () {
  copyToClipboard(document.getElementById('clip-created-modal-link'));
  $('#clip-created-modal-copy-btn').html('Copied Link!');
  setTimeout(function () {
    $('#clip-created-modal-copy-btn').html('<i class="fa fa-copy"></i>&nbsp; Copy');
    $('#clip-created-modal-copy-btn').blur();
  }, 2000);

  sendGoogleAnalyticsEvent('Clip Created Modal', 'Copy Link');
}

function toggleAddToPlaylistMenu () {
  $('#clip-created-modal-recommend-btn').removeClass('selected');
  $('#clip-created-modal-recommend-menu').hide();

  $('#clip-created-modal-add-to-playlist-btn').toggleClass('selected');
  $('#clip-created-modal-add-to-playlist-menu').toggle();
}

function toggleRecommendMenu () {
  $('#clip-created-modal-add-to-playlist-btn').removeClass('selected');
  $('#clip-created-modal-add-to-playlist-menu').hide();

  $('#clip-created-modal-recommend-btn').toggleClass('selected');
  $('#clip-created-modal-recommend-menu').toggle();
}

$('#clip-created-modal-copy-btn').on('click', function () {
  clipCreatedCopyURL();
});

$('#clip-created-modal-add-to-playlist-btn').on('click', function () {
  toggleAddToPlaylistMenu();
});

$('#clip-created-modal-recommend-btn').on('click', function () {
  toggleRecommendMenu();
});

// Playlist Item onclick events
$('.clip-created-modal-playlist').on('click', function () {
  scrapeElementsAndAddToPlaylist(this);
});

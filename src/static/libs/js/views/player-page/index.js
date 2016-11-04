require('../../navbar.js');
require('../../auth.js');
require('../../mediaPlayer.js');
require('../../clipCreatedModal.js');
require('../../createPlaylistModal.js');

import { initClipper } from '../../clipHelper.js';
import { makeClip } from '../../clipHelper.js';
import { setEndTime } from '../../clipHelper.js';
import { setStartTime } from '../../clipHelper.js';
import { toggleMakeClipWidget } from '../../clipHelper.js';

import { truncatePlayerText } from '../../mediaPlayer.js';

import { addToPlaylist } from '../../playlistHelper.js';
import { togglePlaylistWidget } from '../../playlistHelper.js';
import { updatePlaylistItemCount } from '../../playlistHelper.js';

import { toggleRecommendWidget } from '../../recommendHelper.js';

import { debounce } from '../../utility.js';



initClipper();



// Make Clip widget onclick functions
$('#toggle-make-clip-btn').on('click', function () {
  toggleMakeClipWidget(this);
  if ($('#make-clip-start-time input').val() === '') {
    setStartTime();
  }
});

$('#make-clip-start-time button').on('click', function () {
  setStartTime();
});

$('#make-clip-end-time button').on('click', function () {
  setEndTime();
});

$('#make-clip-btn').on('click', function () {
  makeClip();
});

$('#make-clip-cancel').on('click', function () {
  toggleMakeClipWidget();
});



// Add to Playlist widget onclick functions
$('#toggle-playlist-btn').on('click', function () {
  togglePlaylistWidget(this);
});



// Recommend widget onclick functions
$('#toggle-recommend-btn').on('click', function () {
  toggleRecommendWidget(this);
});



// Playlist Item onclick events
$('.add-to-playlist-item .add-to-playlist-item-text').on('click', function () {
  var playlistId = $(this).parent().data('id');
  var mediaRefId = $('#player').data('id');
  addToPlaylist(playlistId, mediaRefId, function (response) {
    updatePlaylistItemCount(playlistId, response.mediaRefs.length);
  });
});

$('.add-to-playlist-item .add-to-playlist-item-link').on('click', function () {
  var playlistId = $(this).parent().data('id');
  window.location.href = '/playlists/' + playlistId;
});



// Playlist Subscribe onclick event
$('#playlist-subscribe').on('click', function () {
  if (!isNonAnonLoggedInUser()) {
    alert('Please login to save a playlist.');
    return;
  }

  if ($(this).html() === 'save') {
    $('#playlist-subscribe').html('<i class="fa fa-star"></i> saved');
    $('#playlist-subscribe').attr('title', 'Unsave playlist');
    subscribeToPlaylist(playlistId);
  } else {
    $('#playlist-subscribe').html('save');
    $('#playlist-subscribe').attr('title', 'Save playlist');
    unsubscribeFromPlaylist(playlistId);
  }
});



// Resize #player-condensed-inner with JS to work with truncation
var truncateOnWindowResize = debounce(function () {
  $('#player-condensed-inner').css('width', $('#player-inner').width());

  if ($('#player-description-truncated').css('display') !== 'none') {
    truncatePlayerText();
  }
}, 250);

window.addEventListener('resize', truncateOnWindowResize);

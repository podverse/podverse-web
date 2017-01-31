require('../../navbar.js');
require('../../auth.js');
require('../../mediaPlayer.js');
require('../../clipCreatedModal.js');
require('../../createPlaylistModal.js');
require('../../createPersonModal.js');

import { initClipper,
         makeClip,
         setEndTime,
         setStartTime,
         toggleMakeClipWidget } from '../../clipHelper.js';
import { sendGoogleAnalyticsPlayerPageView } from '../../googleAnalytics.js';
import { addToPlaylist,
         subscribeToPlaylist,
         togglePlaylistWidget,
         unsubscribeFromPlaylist,
         updatePlaylistItemCount } from '../../playlistHelper.js';
import { toggleRecommendWidget } from '../../recommendHelper.js';
import { debounce, isNonAnonLoggedInUser } from '../../utility.js';



initClipper();



// Make Clip widget onclick functions
$('#toggle-make-clip-btn').on('click', function () {
  toggleMakeClipWidget(this);
  setStartTime();
});

$('#make-clip-start-time button').on('click', function () {
  setStartTime();
});

$('#make-clip-end-time button').on('click', function () {
  setEndTime();
});

$('#make-clip-btn').on('click', function (event) {
  makeClip(event);
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

  if ($(this).html() === '<small>save playlist</small> <i class="fa fa-star-o"></i>') {
    $('#playlist-subscribe').html('<i class="fa fa-star"></i>');
    $('#playlist-subscribe').attr('title', 'Unsave playlist');
    subscribeToPlaylist(playlistId);
  } else {
    $('#playlist-subscribe').html('<small>save playlist</small> <i class="fa fa-star-o"></i>');
    $('#playlist-subscribe').attr('title', 'Save playlist');
    unsubscribeFromPlaylist(playlistId);
  }
});



sendGoogleAnalyticsPlayerPageView();

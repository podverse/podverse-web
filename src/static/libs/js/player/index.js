
require('../addPodcastModal.js');

require('../clipper.js');
require('../playlister.js');
require('../recommender.js');

require('../clipCreatedModal.js');
require('../copyToClipboard.js');


// TODO: should this get its own file?
$('#playlist-subscribe').on('click', function () {
  if (!isNonAnonLoggedInUser()) {
    alert('Login to save a playlist :D');
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



// TODO: should this get its own file?
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



// Resize #player-condensed-inner with JS to work with truncation
$(window).resize(function () {
  var playerWidth = $('#player-inner').width();
  $('#player-condensed-inner').css('width', playerWidth);
  truncatePlayerText();
});

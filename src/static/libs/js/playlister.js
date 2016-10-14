$('#toggle-playlist-btn').on('click', function () {
  togglePlaylistWidget();
});

function togglePlaylistWidget () {
  if ($('#make-clip').css('display') !== 'block' && $('#recommend').css('display') !== 'block') {
    $('#player-stats').toggle();
    $('#player-description').toggle();
    $('#player-episode-image').toggle();
  }

  $('#make-clip').hide();
  $('#toggle-make-clip-btn').removeClass('active');

  $('#recommend').hide();
  $('#toggle-recommend-btn').removeClass('active');

  $('#toggle-playlist-btn').toggleClass('active');
  $('#add-to-playlist').toggle();
}

function createPlaylist (params, callback) {
  if (params.title === '') {
    alert('please provide a playlist title');
    return false;
  }

  $.ajax({
    type: 'POST',
    url: '/playlists/',
    headers: {
      Authorization: $.cookie('idToken')
    },
    data: {
      title: params.title,
      ownerName: params.ownerName,
      isRecommendation: params.isRecommendation
    },
    success: function (response) {
      if (callback) {
        callback(response);
      }
    },
    error: function (xhr, status, error) {
      // TODO: add more helpful error messaging
      alert('errrror');
    }
  });
}

function addToPlaylist (playlistId, mediaRefId, callback) {
  $.ajax({
    type: 'POST',
    url: '/playlists/' + playlistId + '/addItem/' + mediaRefId,
    headers: {
      Authorization: $.cookie('idToken')
    },
    success: function (response) {
      if (callback) {
        callback(response);
      }
    },
    error: function (xhr, status, error) {
      // TODO: add more helpful error messaging
      alert('errrror');
    }
  });
}

function updatePlaylistItemCount(playlistId, total) {
  $(".add-to-playlist-item[data-id=" + playlistId + "] .add-to-playlist-item-count")
    .html("items: " + total);
}

function addNewPlaylistElement(playlist) {
  var playlistId = playlist.id,
      playlistTitle = playlist.title,
      isRecommendation = playlist.isRecommendation;

  var el = '<div class="add-to-playlist-item" data-id="' + playlistId +'">';
      el +=   '<div class="add-to-playlist-item-count">';
      el +=     'items: 0';
      el +=   '</div>';
      el +=   '<div class="add-to-playlist-item-title">';
      el +=     playlistTitle
      el +=   '</div>';
      el += '</div> ';

  if (isRecommendation) {
    $(el).insertBefore($('#recommend .add-to-playlist-item').first());
  } else {
    $(el).insertBefore($('#add-to-playlist .add-to-playlist-item').first());
  }

  $(".add-to-playlist-item[data-id=" + playlistId + "]").on('click', function () {
    var playlistId = $(this).data('id');
    var mediaRefId = $('#player').data('id');
    addToPlaylist(playlistId, mediaRefId, function (response) {
      updatePlaylistItemCount(playlistId, response.mediaRefs.length);
    });
  });
}

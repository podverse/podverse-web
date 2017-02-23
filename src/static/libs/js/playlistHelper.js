import { sendGoogleAnalyticsEvent } from './googleAnalytics.js';
import { isNonAnonLoggedInUser } from './utility.js';

export function togglePlaylistWidget (_this) {
  sendGoogleAnalyticsEvent('Playlist', 'Toggle Playlist Widget');

  if (!isNonAnonLoggedInUser()) {
    alert('Login to create a playlist.');
    return;
  }

  if ($('#make-clip').css('display') !== 'block' && $('#recommend').css('display') !== 'block') {
    $('#player-description-truncated').hide();
    $('#player-description-full').hide();
    $('#playlist').hide();
  }

  if ($(_this).hasClass('active')) {
    $('#player-description-truncated').show();
    $('#playlist').show();
  }

  $('#make-clip').hide();
  $('#toggle-make-clip-btn').removeClass('active');

  $('#recommend').hide();
  $('#toggle-recommend-btn').removeClass('active');

  $('#toggle-playlist-btn').toggleClass('active');
  $('#add-to-playlist').toggle();
}

export function createPlaylist (params, callback) {
  if (params.title === '') {
    alert('Please provide a playlist title.');
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
      alert('Failed to create playlist. Please check your internet connection and try again.');
    }
  });

  sendGoogleAnalyticsEvent('Playlist', 'Create Playlist');
}

export function addToPlaylist (playlistId, mediaRefId, callback) {
  $.ajax({
    type: 'POST',
    url: '/playlists/' + playlistId + '/addItem',
    headers: {
      Authorization: $.cookie('idToken')
    },
    data: {
      mediaRefId: mediaRefId
    },
    success: function (response) {
      if (callback) {
        callback(response);
      }
    },
    error: function (xhr, status, error) {
      alert('Failed to add to playlist. Please check your internet connection and try again.');
    }
  });

  sendGoogleAnalyticsEvent('Playlist', 'Add to Playlist');
}

export function removeFromPlaylist (playlistId, mediaRefId, callback) {
  $.ajax({
    type: 'POST',
    url: '/playlists/' + playlistId + '/removeItem',
    headers: {
      Authorization: $.cookie('idToken')
    },
    data: {
      mediaRefId: mediaRefId
    },
    success: function (response) {
      if (callback) {
        callback(response);
      }
    },
    error: function (xhr, status, error) {
      alert('Failed to remove from playlist. Please check your internet connection and try again.');
    }
  });

  sendGoogleAnalyticsEvent('Playlist', 'Remove from Playlist');
}

export function updatePlaylistItemCount(playlistId, total) {
  $(".add-to-playlist-item[data-id=" + playlistId + "] .add-to-playlist-item-count")
    .html("items: " + total);
}

export function addNewPlaylistElement(playlist) {
  var playlistId = playlist.id,
      playlistTitle = playlist.title,
      isRecommendation = playlist.isRecommendation;

  var el = '<div class="add-to-playlist-item" data-id="' + playlistId +'">';
      el +=   '<a class="add-to-playlist-item-link">';
      el +=     '<i class="fa fa-link"></i>';
      el +=   '</a>';
      el +=   '<div class="add-to-playlist-item-text">';
      el +=     '<div class="add-to-playlist-item-count">';
      el +=       'items: 0';
      el +=     '</div>';
      el +=     '<div class="add-to-playlist-item-title">';
      el +=       playlistTitle
      el +=     '</div>';
      el +=   '</div>'
      el += '</div>';

  if (isRecommendation) {
    $('#recommend .col-xs-12').prepend(el);
  } else {
    $('#add-to-playlist .col-xs-12').prepend(el);
  }

  $(".add-to-playlist-item[data-id=" + playlistId + "] .add-to-playlist-item-text").on('click', function () {
    var playlistId = $(this).parent().data('id');
    var mediaRefId = $('#player').data('id');
    addToPlaylist(playlistId, mediaRefId, function (updatedPlaylistItemCount) {
      updatePlaylistItemCount(playlistId, updatedPlaylistItemCount);
    });
  })

  $(".add-to-playlist-item[data-id=" + playlistId + "] .add-to-playlist-item-link").on('click', function () {
    var playlistId = $(this).parent().data('id');
    window.location.href = '/playlists/' + playlistId;
  });
}

export function subscribeToPlaylist(url, successCallback) {
  var id = url.substr(url.lastIndexOf('/') + 1);

  $.ajax({
    type: 'POST',
    url: '/playlists/subscribe/' + id,
    headers: {
      Authorization: $.cookie('idToken')
    },
    success: function (res) {
      if (successCallback) { successCallback(); }
    },
    error: function (xhr, status, error) {
      alert('Failed to subscribe to playlist. Please check your internet connection and try again.');
    }
  });

  sendGoogleAnalyticsEvent('Playlist', 'Subscribe to Playlist');
}

export function unsubscribeFromPlaylist (url, successCallback) {
  var id = url.substr(url.lastIndexOf('/') + 1);

  $.ajax({
    type: 'POST',
    url: '/playlists/unsubscribe/' + id,
    headers: {
      Authorization: $.cookie('idToken')
    },
    success: function (res) {
      if (successCallback) { successCallback(); }
    },
    error: function (xhr, status, error) {
      alert('Failed to unsubscribe from playlist. Please check your internet connection and try again.');
    }
  });

  sendGoogleAnalyticsEvent('Playlist', 'Unsubscribe to Playlist');
}

export function togglePlaylistEditView() {
  if ($('#playlist-edit small').html() === 'edit') {
    $('.playlist-item').addClass('edit-view');
    $('#playlist-edit').html('<small>done</small> <i class="fa fa-check"></i>');
  } else {
    $('.playlist-item').removeClass('edit-view');
    $('#playlist-edit').html('<small>edit</small> <i class="fa fa-gear"></i>');
  }
}

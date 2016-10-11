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

function addToPlaylist (playlistId, mediaRefId) {
  $.ajax({
    type: 'POST',
    url: '/playlists/' + playlistId + '/addItem/' + mediaRefId,
    headers: {
      Authorization: $.cookie('idToken')
    },
    success: function (response) {
      alert('done!');
    },
    error: function (xhr, status, error) {
      // TODO: add more helpful error messaging
      alert('errrror');
    }
  });
}

// function makeClip () {
//   event.preventDefault();
//
//   if (!isUUID(window.podcastId)) {
//     alert('errrror');
//     return;
//   }
//
//   if (!isInt(window.episodeId)) {
//     alert('errrror');
//     return;
//   }
//
//   $('#make-clip-start-time-error').hide();
//   $('#make-clip-end-time-error').hide();
//   $('#make-clip-start-time').removeClass('has-danger');
//   $('#make-clip-end-time').removeClass('has-danger');
//   $('#make-clip-time').removeClass('has-danger');
//
//   var startTime = $('#make-clip-start-time input').val(),
//       endTime = $('#make-clip-end-time input').val();
//
//   if (startTime === '' && endTime === '') {
//     $('#make-clip-start-time-error').html('Type a start time and/or end time to create a clip.');
//     $('#make-clip-time').addClass('has-danger');
//     $('#make-clip-start-time-error').show();
//     return;
//   }
//
//   if (!isHHMMSS(startTime) && startTime !== '') {
//     $('#make-clip-start-time-error').html('Type time in hh:mm:ss format.');
//     $('#make-clip-start-time').addClass('has-danger');
//     $('#make-clip-start-time-error').show();
//     return;
//   }
//
//   if (!isHHMMSS(endTime) && endTime !== '') {
//     $('#make-clip-end-time-error').html('Type time in hh:mm:ss format.');
//     $('#make-clip-end-time').addClass('has-danger');
//     $('#make-clip-end-time-error').show();
//     return;
//   }
//
//   startTime = convertHHMMSSToSeconds(startTime);
//   endTime = convertHHMMSSToSeconds(endTime);
//
//   if (endTime === 0) {
//     endTime = null;
//   }
//
//   if (startTime === endTime) {
//     $('#make-clip-start-time-error').html('Start time and end time cannot be the same.');
//     $('#make-clip-start-time').addClass('has-danger');
//     $('#make-clip-end-time').addClass('has-danger');
//     $('#make-clip-start-time-error').show();
//     return;
//   }
//
//   if (endTime !== null && endTime <= startTime) {
//     $('#make-clip-start-time-error').html('End time cannot be earlier than start time.');
//     $('#make-clip-start-time').addClass('has-danger');
//     $('#make-clip-end-time').addClass('has-danger');
//     $('#make-clip-start-time-error').show();
//     return;
//   }
//
//   // TODO: how can we prevent malicious scripts in the description?
//   var description = $('#make-clip-description textarea').val();
//
//   // TODO: set owner name based on ownerId
//   var ownerName = 'random owner name';
//
//   // TODO: handle auth to post clip
//   $.ajax({
//     type: 'POST',
//     url: '/clips',
//     headers: {
//       Authorization: $.cookie('idToken')
//     },
//     data: {
//       episode: {
//         id: episodeId,
//         podcast: {
//           id: podcastId
//         }
//       },
//       startTime: startTime,
//       endTime: endTime,
//       description: description,
//       ownerName: ownerName
//     },
//     success: function (response) {
//       if (window.isPlayerPage) {
//         toggleMakeClipWidget();
//         $('#make-clip-start-time').val('');
//         $('#make-clip-end-time').val('');
//         $('#make-clip-description').val('');
//         $('#clip-created-modal-link').val(location.protocol + '\/\/' + location.hostname + (location.port ? ':'+location.port: '')  + '\/clips\/' + response.id);
//         $('#clip-created-modal').modal('show');
//       } else {
//         location.href = '\/clips\/' + response.id;
//       }
//     },
//     error: function (xhr, status, error) {
//       // TODO: add more helpful error messaging
//       alert('errrror');
//     }
//
//   });
//
//   // TODO: view my clips
//
//   // TODO: edit my clips
//
//   // TODO: add CSRF security
// }

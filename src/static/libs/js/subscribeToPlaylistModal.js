function subscribeToPlaylistModal () {
  var playlistURL = $('#subscribeToPlaylistModalURL').val();

  if (playlistURL != null && playlistURL != '') {
    var spinnerEl = $('<i class="fa fa-spinner fa-spin"><i>');
    $('#subscribeToPlaylistModalURL').html(spinnerEl);

    function successCallback () {
      location.reload();
    }

    subscribeToPlaylist(playlistURL, successCallback);

  } else {
    alert('errrror');
    $('#addPodcastModalAddButton').html('Add');
  }
}

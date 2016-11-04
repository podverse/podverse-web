function showNewPersonModal() {
  if (isNonAnonLoggedInUser()) {
    $('#createPersonModal').modal('show');
  } else {
    alert('Please login to create playlists for friends.');
  }
}

$('#createPersonModalAddButton').on('click', function () {
  var newPlaylist = {};
  newPlaylist.title = $('#createPersonModalName').val();
  newPlaylist.isRecommendation = true;
  createPlaylist(newPlaylist, function (response) {
    addNewPlaylistElement(response);
    $('#createPersonModal').modal('hide');
  });
});

$('#createPersonModal').on('shown.bs.modal', function () {
  $('#createPersonModalName').focus();
});

$('#createPersonModalName').bind('keypress', function (event) {
  if (event.keyCode == 13) {
    event.preventDefault();
    var newPlaylist = {};
    newPlaylist.title = $('#createPersonModalName').val();
    newPlaylist.isRecommendation = true;

    createPlaylist(newPlaylist, function (response) {
      addNewPlaylistElement(response);
      $('#createPersonModal').modal('hide');
    });
  }
});

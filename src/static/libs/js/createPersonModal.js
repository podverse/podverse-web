function showNewPersonModal() {
  if (isNonAnonLoggedInUser()) {
    $('#createPersonModal').modal('show');
  } else {
    alert('Login to create a playlist for a friend :D');
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

import { addNewPlaylistElement, createPlaylist } from './playlistHelper.js';

$('#createPlaylistModalAddButton').on('click', function () {
  var newPlaylist = {};
  newPlaylist.title = $('#createPlaylistModalTitle').val();
  createPlaylist(newPlaylist, function (response) {
    addNewPlaylistElement(response);
    $('#createPlaylistModal').modal('hide');
  });
});

$('#createPlaylistModal').on('shown.bs.modal', function () {
  $('#createPlaylistModalTitle').focus();
});

$('#createPlaylistModalTitle').bind('keypress', function (event) {
  if (event.keyCode == 13) {
    event.preventDefault(event);
    var newPlaylist = {};
    newPlaylist.title = $('#createPlaylistModalTitle').val();

    createPlaylist(newPlaylist, function (response) {
      addNewPlaylistElement(response);
      $('#createPlaylistModal').modal('hide');
    });
  }
});

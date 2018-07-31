require('./iosLoginModal.js');

import { addPodcastModalSave } from './addPodcastModal.js';
import { logoutUser } from './auth.js';

$('#navbarSearchModal').on('shown.bs.modal', function () {
  $('#navbarSearchModalInput').focus()
});

$('#addPodcastModalAddButton').on('click', function () {
  addPodcastModalSave();
});

$('#navbarSearchModalRequestPodcast').on('click', function () {
  $('#navbarSearchModal').modal('hide');
});

$('#navbarSearchModalInput').bind('keypress', function (event) {
  if (event.keyCode == 13) {
    event.preventDefault(event);
    const query = $('#navbarSearchModalInput').val();
    window.location = `/search?query=${query}`;
  }
});

$('#navbarSearchModal .search-podcasts-btn').on('click', function () {
  const query = $('#navbarSearchModalInput').val();
  window.location = `/search?query=${query}`;
});

$('#logout-user-dropdown-item, #logout-user-nav-link').on('click', function () {
  logoutUser();
});

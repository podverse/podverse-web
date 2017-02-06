import { addPodcastModalSave } from './addPodcastModal.js';
import { logoutUser } from './auth.js';
import { loadPodcastSearchTypeahead } from './podcastHelper.js';

// $('#navbarSearchModalRequestPodcast').show();

$('#navbarSearchModal').on('shown.bs.modal', function () {
  $('#navbarSearchModalInput').focus()
});
loadPodcastSearchTypeahead();

$('#addPodcastModalAddButton').on('click', function () {
  addPodcastModalSave();
});

$('#navbarSearchModalRequestPodcast').on('click', function () {
  $('#navbarSearchModal').modal('hide');
})

$('#navbarSearchModalInput').bind('keypress', function (event) {
  if (event.keyCode == 13) {
    event.preventDefault(event);
  }
})

$('#logout-user-dropdown-item, #logout-user-nav-link').on('click', function () {
  logoutUser();
});

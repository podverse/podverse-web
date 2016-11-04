import { isNonAnonLoggedInUser } from './utility.js';

export function toggleRecommendWidget (_this) {
  if (!isNonAnonLoggedInUser()) {
    alert('Please login to make playlists for friends.');
    return;
  }

  if ($('#make-clip').css('display') !== 'block' && $('#add-to-playlist').css('display') !== 'block') {
    $('#player-stats').toggle();
    $('#player-description').hide();
    $('#player-episode-image').toggle();
  }

  if ($(_this).hasClass('active')) {
    $('#player-description').show();
  }

  $('#make-clip').hide();
  $('#toggle-make-clip-btn').removeClass('active');

  $('#add-to-playlist').hide();
  $('#toggle-playlist-btn').removeClass('active');

  $('#recommend').toggle();
  $('#toggle-recommend-btn').toggleClass('active');
}

import { sendGoogleAnalyticsEvent } from './googleAnalytics.js';
import { isNonAnonLoggedInUser } from './utility.js';

export function toggleRecommendWidget (_this) {
  sendGoogleAnalyticsEvent('Recommend', 'Toggle Reccomend Widget');

  if (!isNonAnonLoggedInUser()) {
    alert('Please login to create a playlist for someone.');
    return;
  }

  if ($('#make-clip').css('display') !== 'block' && $('#add-to-playlist').css('display') !== 'block') {
    $('#player-description-truncated').hide();
    $('#player-description-full').hide();
  }

  if ($(_this).hasClass('active')) {
    $('#player-description-truncated').show();
  }

  $('#make-clip').hide();
  $('#toggle-make-clip-btn').removeClass('active');

  $('#add-to-playlist').hide();
  $('#toggle-playlist-btn').removeClass('active');

  $('#recommend').toggle();
  $('#toggle-recommend-btn').toggleClass('active');
}

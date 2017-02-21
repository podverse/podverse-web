require('../../navbar.js');
require('../../auth.js');

import { sendGoogleAnalyticsPodcastPageView, sendGoogleAnalyticsEvent } from '../../googleAnalytics.js';
import { subscribeToPodcast, unsubscribeFromPodcast } from '../../podcastHelper.js';
import { isNonAnonLoggedInUser } from '../../utility.js';

$('#podcast-subscribe').on('click', function () {
  if (!isNonAnonLoggedInUser()) {
    alert('Please login to subscribe to this podcast.');
    return;
  }

  if ($(this).children().hasClass('fa-star-o')) {
    $('#podcast-subscribe').html('<i class="fa fa-star"></i>');
    $('#podcast-subscribe').attr('title', 'Unsubscribe from podcast');
    subscribeToPodcast(window.podcastFeedURL);
  } else {
    $('#podcast-subscribe').html('<small>subscribe</small> <i class="fa fa-star-o"></i>');
    $('#podcast-subscribe').attr('title', 'Subscribe to podcast');
    unsubscribeFromPodcast(window.podcastFeedURL);
  }
});

$('#podcast-summary-truncated').on('click', function () {
  $('#podcast-summary-truncated, #podcast-summary-full').toggle();
})

$(document).ready(function ($) {
  $('.clickable-row').click(function() {
    window.location = $(this).data('href');
  });

  if (isSubscribed) {
    $('#podcast-subscribe').html('<i class="fa fa-star"></i>')
  } else {
    $('#podcast-subscribe').html('<small>subscribe</small> <i class="fa fa-star-o"></i>')
  }

});

if (showNextButton) {
  $('.pv-pagination-next').on('click', function () {
    sendGoogleAnalyticsEvent('Pagination', 'Next');
    window.location = window.location.pathname + '?page=' + (pageIndex + 1);
  });
}

if (pageIndex > 1) {
  $('.pv-pagination-prev').on('click', function () {
    sendGoogleAnalyticsEvent('Pagination', 'Prev');
    window.location = window.location.pathname + '?page=' + (pageIndex - 1);
  });
}

sendGoogleAnalyticsPodcastPageView();

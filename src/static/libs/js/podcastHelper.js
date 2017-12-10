import { sendGoogleAnalyticsEvent } from './googleAnalytics.js';

export function loadPodcastSearchTypeahead() {
  var podcastResults = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: __BASE_URL__ + '/podcasts?title=%QUERY',
      wildcard: '%QUERY'
    }
  });

  $('#navbarSearchModalInput').typeahead({
    hint: false,
    highlight: true,
    minLength: 1
  }, {
    name: 'podcasts',
    display: 'title',
    source: podcastResults
  }).on('typeahead:selected typeahead:autocomplete', function (event, selection) {
    window.location.href = '/podcasts/' + selection.id;
  });
}

export function subscribeToPodcast(podcastFeedUrl) {
  $.ajax({
    type: 'POST',
    url: '/podcasts/subscribe/',
    headers: {
      Authorization: $.cookie('idToken')
    },
    data: {
      // TODO: HACK: DANGER: We shouldn't be POSTing window fields to the db
      podcastFeedUrl: window.podcastFeedUrl
    },
    error: function (xhr, status, error) {
      alert('Failed to subscribe to podcast. Please check your internet connection and try again.');
    }
  });

  sendGoogleAnalyticsEvent('Podcast', 'Subscribe to Podcast');
}

export function unsubscribeFromPodcast (podcastFeedUrl) {
  $.ajax({
    type: 'POST',
    url: '/podcasts/unsubscribe/',
    headers: {
      Authorization: $.cookie('idToken')
    },
    data: {
      // TODO: HACK: DANGER: We shouldn't be POSTing window fields to the db
      podcastFeedUrl: window.podcastFeedUrl
    },
    error: function (xhr, status, error) {
      alert('Failed to unsubscribe from podcast. Please check your internet connection and try again.');
    }
  });

  sendGoogleAnalyticsEvent('Podcast', 'Unsubscribe from Podcast');
}

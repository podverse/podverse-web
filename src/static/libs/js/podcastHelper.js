import { sendGoogleAnalyticsEvent } from './googleAnalytics.js';

// export function loadPodcastSearchTypeahead() {
//   var podcastResults = new Bloodhound({
//     datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
//     queryTokenizer: Bloodhound.tokenizers.whitespace,
//     remote: {
//       url: __BASE_URL__ + '/podcasts?title=%QUERY',
//       wildcard: '%QUERY'
//     }
//   });

//   $('#navbarSearchModalInput').typeahead({
//     hint: false,
//     highlight: true,
//     minLength: 1
//   }, {
//     name: 'podcasts',
//     display: 'title',
//     source: podcastResults
//   }).on('typeahead:selected typeahead:autocomplete', function (event, selection) {
//     window.location.href = '/podcasts/' + selection.id;
//   });
// }

export function searchPodcasts(query) {
  sendGoogleAnalyticsEvent('Podcast', 'Search for podcast');
  
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      url: '/podcasts',
      data: {
        $limit: 25,
        title: query
      },
      success: response => {
        resolve(response);
      },
      error: err => {
        reject(err);
      }
    });
  });
}

export function subscribeToPodcast(podcastId) {
  $.ajax({
    type: 'POST',
    url: '/podcasts/subscribe/',
    headers: {
      Authorization: $.cookie('idToken')
    },
    data: {
      podcastId: window.podcastId
    },
    error: function (xhr, status, error) {
      alert('Failed to subscribe to podcast. Please check your internet connection and try again.');
    }
  });

  sendGoogleAnalyticsEvent('Podcast', 'Subscribe to Podcast');
}

export function unsubscribeFromPodcast (podcastId) {
  $.ajax({
    type: 'POST',
    url: '/podcasts/unsubscribe/',
    headers: {
      Authorization: $.cookie('idToken')
    },
    data: {
      podcastId: window.podcastId
    },
    error: function (xhr, status, error) {
      alert('Failed to unsubscribe from podcast. Please check your internet connection and try again.');
    }
  });

  sendGoogleAnalyticsEvent('Podcast', 'Unsubscribe from Podcast');
}

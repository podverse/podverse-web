import { sendGoogleAnalyticsEvent } from './googleAnalytics.js';

export function loadPodcastSearchTypeahead() {
  var podcastResults = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      // TODO: this needs to conditionally handle production and development
      url: 'http://localhost:8080/podcasts?title=%QUERY',
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

export function subscribeToPodcast(id) {
  $.ajax({
    type: 'POST',
    url: '/podcasts/subscribe/' + id,
    headers: {
      Authorization: $.cookie('idToken')
    },
    // success: TODO: handle loading spinner
    // success: function (res) {
    //   console.log(res);
    // },
    error: function (xhr, status, error) {
      // TODO: add more helpful error messaging
      alert('errrror');
    }
  });

  sendGoogleAnalyticsEvent('Podcast', 'Subscribe to Podcast');
}

export function unsubscribeFromPodcast (id) {
  $.ajax({
    type: 'POST',
    url: '/podcasts/unsubscribe/' + id,
    headers: {
      Authorization: $.cookie('idToken')
    },
    // success: TODO: handle loading spinner
    error: function (xhr, status, error) {
      // TODO: add more helpful error messaging
      alert('errrror');
    }
  });

  sendGoogleAnalyticsEvent('Podcast', 'Unsubscribe from Podcast');
}

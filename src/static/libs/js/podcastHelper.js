export function loadPodcastSearchTypeahead() {
  var podcastResults = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
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
}

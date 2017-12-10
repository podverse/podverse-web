import { sendGoogleAnalyticsEvent } from './googleAnalytics.js';

export function addPodcastModalSave () {
  var feedUrl = $('#addPodcastModalFeedUrl').val();

  if (feedUrl != null && feedUrl != '') {
    var spinnerEl = $('<i class="fa fa-spinner fa-spin"><i>');
    $('#addPodcastModalAddButton').html(spinnerEl);

    // If a podcast with the feedUrl is already in the db, then nav to its page.
    // Else parse the feed and add it to the db, then nav to its page.
    $.get('/podcasts/alias?feedUrl=' + feedUrl)
      .done(function (data) {
        if (data.length > 0) {
          location.href = '/podcasts/' + data[0].id;
        } else {
          $.post('/parse', { feedUrl: feedUrl })
            .done(function (data) {
              $('#addPodcastModal').modal('hide');
              $('#addPodcastModalAddButton').html('Add');
              window.location = '/podcasts/' + data.id;
            })
            .fail(function (error) {
                alert(`Podcast feed parsing failed. You might not have admin permission, or you provided an invalid RSS feed URL. Contact us if you want help :)`);
              $('#addPodcastModalAddButton').html('Add');
            });
        }
      })
  } else {
    alert(`Please provide a valid podcast RSS feed URL.`)
    $('#addPodcastModalAddButton').html('Add');
  }

  sendGoogleAnalyticsEvent('Add Podcast Modal', 'Save');
}

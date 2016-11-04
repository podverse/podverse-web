export function addPodcastModalSave () {
  var feedURL = $('#addPodcastModalFeedURL').val();

  if (feedURL != null && feedURL != '') {
    var spinnerEl = $('<i class="fa fa-spinner fa-spin"><i>');
    $('#addPodcastModalAddButton').html(spinnerEl);

    // If a podcast with the feedURL is already in the db, then nav to its page.
    // Else parse the feed and add it to the db, then nav to its page.
    $.get('/podcasts?feedURL=' + feedURL)
      .done(function (data) {
        if (data.length > 0) {
          location.href = '/podcasts/' + data[0].id;
        } else {
          $.post('/parse', { feedURL: feedURL })
            .done(function (data) {
              $('#addPodcastModal').modal('hide');
              $('#addPodcastModalAddButton').html('Add');
              window.location = '/podcasts/' + data.id;
            })
            .fail(function (error) {
              // TODO: add more helpful error messaging
              alert('errrror');
              $('#addPodcastModalAddButton').html('Add');
            });
        }
      })
  } else {
    alert('errrror');
    $('#addPodcastModalAddButton').html('Add');
  }
}

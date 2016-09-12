function addPodcastModal () {
  var feedURL = $('#addPodcastModalFeedURL').val();

  if (feedURL != null && feedURL != '') {
    var spinnerEl = $('<i class="fa fa-spinner fa-spin"><i>');
    $('#addPodcastModalAddButton').html(spinnerEl);

    $.post('parse', { feedURL: feedURL })
      .done(function (data) {
        $('#addPodcastModal').modal('hide');
        $('#addPodcastModalAddButton').html('Add');
        selectPodcast(data);
      })
      .fail(function (error) {
        // TODO: add more helpful error messaging
        alert('errrror');
        $('#addPodcastModalAddButton').html('Add');
      });
  } else {
    alert('errrror');
    $('#addPodcastModalAddButton').html('Add');
  }
}

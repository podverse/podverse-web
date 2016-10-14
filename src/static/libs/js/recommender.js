$('#toggle-recommend-btn').on('click', function () {
  toggleRecommendWidget();
});

function toggleRecommendWidget () {
  if ($('#make-clip').css('display') !== 'block' && $('#add-to-playlist').css('display') !== 'block') {
    $('#player-stats').toggle();
    $('#player-description').toggle();
    $('#player-episode-image').toggle();
  }

  $('#make-clip').hide();
  $('#toggle-make-clip-btn').removeClass('active');

  $('#add-to-playlist').hide();
  $('#toggle-playlist-btn').removeClass('active');

  $('#recommend').toggle();
  $('#toggle-recommend-btn').toggleClass('active');
}

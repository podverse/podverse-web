function initClipper () {

  $('#make-clip-start-time i').on('click', function () {
    var startTime = $('#make-clip-start-time input').val() || "0";
    var endTime = $('#make-clip-end-time input').val();
    startTime = convertHHMMSSToSeconds(startTime);
    endTime = convertHHMMSSToSeconds(endTime);
    previewStartTime(startTime, endTime);
  });

  $('#make-clip-end-time i').on('click', function () {
    var endTime = $('#make-clip-end-time input').val() || "3";
    endTime = convertHHMMSSToSeconds(endTime);
    previewEndTime(endTime);
  });

  $('#make-clip-start-time input').on('focusin', function () {
    $('#make-clip-time-set').html('Set Start');
  });

  $('#make-clip-end-time input').on('focusin', function () {
    $('#make-clip-time-set').html('Set End');
  });

  $('#make-clip-time-set').on('click', function () {
    var currentTimeHHMMSS = convertSecToHHMMSS(Math.floor(audio.currentTime));
    var currentSetMode = $('#make-clip-time-set').html();
    if (currentSetMode === 'Set Start') {
      $('#make-clip-start-time input').val(currentTimeHHMMSS);
      $('#make-clip-end-time input').focus();
      $('#make-clip-time-set').html('Set End');
    } else if (currentSetMode === 'Set End') {
      $('#make-clip-end-time input').val(currentTimeHHMMSS);
      $('#make-clip-time-set').html('Set Start');
      $('#make-clip-description textarea').focus();
    }
  });

  $('#player').on('mousedown', function (e) {
    e.preventDefault();
  });

  $('#make-clip-time-set').on('mousedown', function (e) {
    e.preventDefault();
  });

  $('#make-clip-time-back').on('mousedown', function (e) {
    e.preventDefault();
  });

  $('#make-clip-time-forwards').on('mousedown', function (e) {
    e.preventDefault();
  });

  $('#make-clip-time-back').on('click', function () {
    audio.currentTime = audio.currentTime - 15;
  });

  $('#make-clip-time-forwards').on('click', function () {
    audio.currentTime = audio.currentTime + 15;
  });

}

function makeClip () {
  event.preventDefault();

  if (!isUUID(window.podcastId)) {
    alert('errrror');
    return;
  }

  if (!isInt(window.episodeId)) {
    alert('errrror');
    return;
  }

  $('#make-clip-start-time-error').hide();
  $('#make-clip-end-time-error').hide();
  $('#make-clip-start-time').removeClass('has-danger');
  $('#make-clip-end-time').removeClass('has-danger');
  $('#make-clip-time').removeClass('has-danger');

  var startTime = $('#make-clip-start-time input').val(),
      endTime = $('#make-clip-end-time input').val();

  if (startTime === '' && endTime === '') {
    $('#make-clip-start-time-error').html('Type a start time and/or end time to create a clip.');
    $('#make-clip-time').addClass('has-danger');
    $('#make-clip-start-time-error').show();
    return;
  }

  if (!isHHMMSS(startTime) && startTime !== '') {
    $('#make-clip-start-time-error').html('Type time in hh:mm:ss format.');
    $('#make-clip-start-time').addClass('has-danger');
    $('#make-clip-start-time-error').show();
    return;
  }

  if (!isHHMMSS(endTime) && endTime !== '') {
    $('#make-clip-end-time-error').html('Type time in hh:mm:ss format.');
    $('#make-clip-end-time').addClass('has-danger');
    $('#make-clip-end-time-error').show();
    return;
  }

  startTime = convertHHMMSSToSeconds(startTime);
  endTime = convertHHMMSSToSeconds(endTime);

  if (endTime === 0) {
    endTime = null;
  }

  if (startTime === endTime) {
    $('#make-clip-start-time-error').html('Start time and end time cannot be the same.');
    $('#make-clip-start-time').addClass('has-danger');
    $('#make-clip-end-time').addClass('has-danger');
    $('#make-clip-start-time-error').show();
    return;
  }

  if (endTime !== null && endTime <= startTime) {
    $('#make-clip-start-time-error').html('End time cannot be earlier than start time.');
    $('#make-clip-start-time').addClass('has-danger');
    $('#make-clip-end-time').addClass('has-danger');
    $('#make-clip-start-time-error').show();
    return;
  }

  // TODO: how can we prevent malicious scripts in the description?
  var description = $('#make-clip-description textarea').val();

  // TODO: set owner name based on ownerId
  var ownerName = 'random owner name';

  // TODO: handle auth to post clip
  $.ajax({
    type: 'POST',
    url: '/clips',
    headers: {
      Authorization: $.cookie('idToken')
    },
    data: {
      episode: {
        id: episodeId,
        podcast: {
          id: podcastId
        }
      },
      startTime: startTime,
      endTime: endTime,
      description: description,
      ownerName: ownerName
    },
    success: function (response) {
      if (window.isPlayerPage) {
        $('#player-make-clip').hide();
        $('#clip-created-modal-link').val(location.protocol + '\/\/' + location.hostname + (location.port ? ':'+location.port: '')  + '\/clips\/' + response.id);
        $('#clip-created-modal').modal('show');
      } else {
        location.href = '\/clips\/' + response.id;
      }
    },
    error: function (xhr, status, error) {
      // TODO: add more helpful error messaging
      alert('errrror');
    }

  });

  // TODO: view my clips

  // TODO: edit my clips

  // TODO: add CSRF security
}


function initMakeClipPodcastSearch () {
    window.clip = {};

    // Start time === 0 && endTime === null sets it to be handled as an episode
    // by the media player
    window.startTime = 0;
    window.endTime = null;

    var podcastResults = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: 'http://localhost:8080/podcasts?title=%QUERY',
        wildcard: '%QUERY'
      }
    });

    $('#make-clip-podcast input').typeahead({
      hint: false,
      highlight: true,
      minLength: 1
    }, {
      name: 'podcasts',
      display: 'title',
      source: podcastResults
    }).on('typeahead:selected typeahead:autocomplete', function (event, selection) {
      selectPodcast(selection);
    });
}

function selectPodcast(selection) {
  $('#make-clip-podcast input').val(selection.title);

  // Destroy existing episode typeahead instance so that the source will be refreshed
  $('#make-clip-episode input').typeahead('destroy');

  var episodeResults = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: 'http://localhost:8080/podcasts/' + selection.id,
      cache: false,
      transform: function (response) {
        if (response.episodes) {
          $('#make-clip-podcast').removeClass('has-danger');
          window.podcastId = selection.id;
          $('#make-clip-podcast input').attr('disabled', true);
          $('#make-clip-podcast-add').hide();
          $('#make-clip-podcast .twitter-typeahead').append('<div class="input-button-right" onclick="clearPodcastInput();"><i class="fa fa-times"></i></div>');
          $('#make-clip-podcast .input-button-right').show();
          $('#make-clip-episode').show();
          $('#make-clip-episode input').attr('disabled', false);
          $('#make-clip-episode input').focus();
        }

        return $.map(response.episodes, function (episode) {
          return {
            title: episode.title,
            id: episode.id,
            mediaURL: episode.mediaURL
          }
        });
      },
    }
  });

  $('#make-clip-episode input').typeahead({
    hint: false,
    highlight: true,
    minLength: 1
  }, {
    name: 'episodes',
    display: 'title',
    source: episodeResults
  }).on('typeahead:selected typeahead:autocomplete', function (e, selection) {
    $('#make-clip-episode').removeClass('has-danger');
    window.episodeId = selection.id;
    $('#make-clip-episode input').attr('data-media-url', selection.mediaURL);
    $('#make-clip-episode input').attr('disabled', true);
    $('#make-clip-episode .twitter-typeahead').append('<div class="input-button-right" onclick="clearEpisodeInput();"><i class="fa fa-times"></i></div>');
    $('#make-clip-episode .input-button-right').show();

    $('#make-clip-start-time input').attr('disabled', false);
    $('#make-clip-end-time input').attr('disabled', false);
    $('#make-clip-time').show();

    $('#make-clip-description textarea').attr('disabled', false);
    $('#make-clip-description').show();

    $('#make-clip-btn').show();

    window.episodeMediaURL = $('#make-clip-episode input').attr('data-media-url');
    createAndAppendAudio();
    $('#player-container').show();

    $('#make-clip-start-time input').focus();
  });
}

function clearPodcastInput () {
  $('#make-clip-podcast .input-button-right').hide();
  $('#make-clip-podcast input').attr('disabled', false);
  $('#make-clip-podcast input').val('');
  $('#make-clip-podcast-add').show();

  clearEpisodeInput();
  $('#make-clip-episode').hide();
}

function clearEpisodeInput () {
  $('#make-clip-episode .input-button-right').hide();
  $('#make-clip-episode input').attr('disabled', false);
  $('#make-clip-episode input').val('');

  destroyPlayerAndAudio();

  $('#make-clip-time').hide();
  $('#make-clip-start-time input').val('');
  $('#make-clip-end-time input').val('');

  $('#make-clip-description').hide();
  $('#make-clip-description textarea').val('');

  $('#make-clip-btn').hide();
}

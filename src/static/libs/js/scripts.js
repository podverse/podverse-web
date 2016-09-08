/*eslint-disable*/
'use strict';

// Set default values for vars that handle player crashes and autoplay functionality
window.restartAttempts = 0;
window.lastPlaybackPosition = -1;
window.endTimeHasBeenReached = false;

function convertSecToHHMMSS (sec) {
  // thanks to dkreuter http://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
  var totalSec = sec;

  var hours = parseInt(totalSec / 3600) % 24;
  var minutes = parseInt(totalSec / 60) % 60;
  var seconds = totalSec % 60;
  var result = '';

  if (hours > 0) {
    result += hours + ':';
  }

  if (minutes > 9) {
    result += minutes + ':';
  } else if (minutes > 0 && hours > 0) {
    result += '0' + minutes + ':';
  } else if (minutes > 0){
    result += minutes + ':';
  }

  if (seconds > 9) {
    result += seconds;
  } else if (seconds > 0 && minutes > 0) {
    result += '0' + seconds + ':';
  } else if (seconds > 0) {
    result += seconds;
  } else {
    result += '00';
  }

  return result
}

function readableDate (date) {
  return date.substring(0, 10);
}

function convertHHMMSSToSeconds (hhmmssString) {

  var hhmmssArray = hhmmssString.split(':') || 0,
    hours = 0,
    minutes = 0,
    seconds = 0;

  if (hhmmssArray.length === 3) {
    hours = parseInt(hhmmssArray[0]);
    minutes = parseInt(hhmmssArray[1]);
    seconds = parseInt(hhmmssArray[2]);


    if (hours < 0 || minutes > 59 || minutes < 0 || seconds > 59 || seconds < 0) {
      console.log('errrror');
      return -1;
    }

    hours = hours * 3600;
    minutes = minutes * 60;

  } else if (hhmmssArray.length === 2) {
    minutes = parseInt(hhmmssArray[0]);
    seconds = parseInt(hhmmssArray[1]);

    if (minutes > 59 || minutes < 0 || seconds > 59 || seconds < 0) {
      console.log('errrror');
      return -1;
    }

    minutes = minutes * 60;

  } else if (hhmmssArray.length === 1) {
    seconds = parseInt(hhmmssArray[0]) || 0;

    if (seconds > 59 || seconds < 0) {
      console.log('errrror');
      return -1;
    }

  } else {
    console.log('errrror');
    return -1;
  }

  return hours + minutes + seconds;

}

function isHHMMSS (val) {
  var pattern = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
  return pattern.test(val);
}

function isInt (val) {
  return !isNaN(val) &&
          parseInt(Number(val)) == val &&
          !isNaN(parseInt(val, 10));
}

function isUUID (val) {
  var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return pattern.test(val);
}

// Podcast / Episode / Clip variables added to the window
// object in player.html

function loadMediaRef (index, shouldPlay) {
  var item = mediaRefs[index];

  // Only clips have a startTime and endTime
  startTime = item.startTime;
  endTime = item.endTime;

  if (window.startTime === 0 && window.endTime === null) {
    isEpisode = true;
  } else {
    isEpisode = false;
  }

  if (isEpisode === false) {
    clipTitle = item.title;
    duration = item.duration;
    podcastTitle = item.episode.podcast.title;
    podcastImageURL = item.episode.podcast.imageURL;
    episodeTitle = item.episode.title;
    episodeMediaURL = item.episode.mediaURL;
    episodePubDate = item.episode.pubDate;
  } else { // handle item as episode
    clipTitle = "";
    duration = item.duration;
    podcastTitle = item.episode.podcast.title;
    podcastImageURL = item.episode.podcast.imageURL;
    episodeTitle = item.episode.title;
    episodeMediaURL = item.episode.mediaURL;
    episodePubDate = item.episode.pubDate;
    startTime = 0;
  }

  window.location.hash = index + 1;

  setPlayerInfo();
  createAndAppendAudio();
  if (shouldPlay) {
    audio.play();
  }
}

function previewStartTime (startTime, endTime) {
  window.endTimeHasBeenReached = false;
  window.endTime = endTime;
  audio.currentTime = window.startTime = startTime;
  audio.play();
}

function previewEndTime (endTime) {
  window.endTimeHasBeenReached = false;
  window.endTime = endTime;
  audio.currentTime = endTime - 3;
  audio.play();
}

function setPlayerInfo () {

  if (window.startTime === 0 && window.endTime === null) {
    isEpisode = true;
  } else {
    isEpisode = false;
    endTime = parseInt(window.endTime)
  }

  $('#player-header').show();

  if (isEpisode === false) {
    $('#player-image img').attr('src', podcastImageURL);
    $('#player-restart-clip').css('display', 'block');
    $('#player-title').css('padding', '0.75rem 0 1rem 0');
    $('#player-podcast-title').html(podcastTitle);
    $('#player-sub-title').html(episodeTitle);
    $('#player-condensed-title').html(clipTitle);
    $('#player-title').html(clipTitle);
    $('#player-stats-duration').html('Clip: ' + convertSecToHHMMSS(duration) + ' - ' + convertSecToHHMMSS(startTime) + ' to ' + convertSecToHHMMSS(endTime));
    $('#player-stats-listens').html('Listens: 1234');
    $('#player-restart-clip').html('Restart Clip');
  } else {
    $('#player-restart-clip').css('display', 'none');
    $('#player-title').css('padding', '0.5rem 0 0.75rem 0');
    $('#player-image img').attr('src', podcastImageURL);
    $('#player-podcast-title').html(podcastTitle);
    $('#player-sub-title').html(episodeTitle);
    $('#player-condensed-title').html(episodeTitle);
    $('#player-title').html('');
    $('#player-stats-duration').html('Full Episode: ' + readableDate(episodePubDate));
    $('#player-stats-listens').html('Listens: 1234');
  }

  window.restartAttempts = 0;
  window.lastPlaybackPosition = -1;
  window.endTimeHasBeenReached = false;

}

function createAndAppendAudio () {

  // If audio player elements are already on the page, remove them first.
  $('.mejs-offscreen').remove();
  $('.mejs-container').remove();

  window.audio = document.createElement('audio');
  audio.setAttribute('src', episodeMediaURL);
  audio.setAttribute('type', 'audio/mpeg');
  audio.setAttribute('codecs', 'mp3');
  audio.preload = "auto";
  $('#player').append(audio);

  $('audio').mediaelementplayer({
    alwaysShowHours: true
  });

  audio.onloadedmetadata = function() {
    // NOTE: If the lastPlaybackPosition is greater than -1, then the audio player must
    // have crashed and then restarted, and we should resume from the last saved
    // playback position. Else begin from the clip start time.
    if (lastPlaybackPosition > -1) {
      audio.currentTime = window.lastPlaybackPosition;
    } else {
      audio.currentTime = window.startTime || 0;
    }
  };

  audio.oncanplaythrough = function() {
    var autoplay = $.cookie('autoplay');
    if (autoplay === 'On') {
      audio.play();
    }
  }

  // When playing a clip, prevent issue where the media file starts playing
  // from the beginning for a split second before adjusting the startTime.
  var pauseBeforeFirstPlay = false;
  audio.onplaying = function() {
    if (!pauseBeforeFirstPlay) {
      audio.pause();
      setTimeout(function() {
        audio.play();
        pauseBeforeFirstPlay = true;
      }, 1);
    }
  }

  audio.ontimeupdate = function() {

    // Skip to start time once when the user first hits play on mobile devices
    if (lastPlaybackPosition === -1) {
      audio.currentTime = startTime;
    }

    // Stop the clip once when the end time has been reached
    if (Math.floor(audio.currentTime) === endTime && endTimeHasBeenReached === false) {
      endTimeHasBeenReached = true;
      audio.pause();
    }

    // TODO: Can this be made more efficient than rewriting the lastPlaybackPosition
    // whenever time updates?
    lastPlaybackPosition = audio.currentTime;
  };

  audio.onerror = function(e) {
    switch (e.target.error.code) {
      case e.target.error.MEDIA_ERR_ABORTED:
        console.log('Aborted the video playback.');
        break;
      // Chrome will frequently throw a MEDIA_ERR_NETWORK error and crash when seeking
      // to a position in a clip. I have encountered the issue with native HTML 5 Chrome
      // components, as well as with 3rd party libraries like JWPlayer and MediaElement.
      // The only work around for this bug I have found is to listen for the error,
      // then remove the <audio> element and recreate and append the audio element.
      // TODO: Is there a better work around or resolution for the Chrome bug?
      case e.target.error.MEDIA_ERR_NETWORK:
        console.log('A network error caused the audio download to fail.');
        if (restartAttempts < 5) {
          restartAttempts++;
          $('#player').empty();
          createAndAppendAudio();
        }
        break;
      case e.target.error.MEDIA_ERR_DECODE:
        console.log('The audio playback was aborted due to a corruption problem or because the video used features your browser did not support.');
        break;
      case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        console.log('The video audio not be loaded, either because the server or network failed or because the format is not supported.');
        break;
      default:
        console.log('An unknown error occurred.');
        break;
    }
  };

};

$('#player-restart-clip').on('click', function() {
  audio.pause();
  endTimeHasBeenReached = false;
  audio.currentTime = startTime;
  audio.play();
});

$('#player-autoplay').on('click', function() {
  toggleAutoplay();
});

function toggleAutoplay () {
  var autoplay = $.cookie('autoplay');
  if (autoplay !== 'On') {
    $.cookie('autoplay', 'On');
    $('#player-autoplay').html('Autoplay On');
  } else {
    $.cookie('autoplay', 'Off');
    $('#player-autoplay').html('Autoplay Off');
  }
}

function createAutoplayBtn () {
  var autoplay = $.cookie('autoplay');
  if (autoplay === 'On') {
    $('#player-autoplay').html('Autoplay On');
  } else {
    $.cookie('autoplay', 'Off');
    $('#player-autoplay').html('Autoplay Off');
  }
}

$('.playlist-item').on('click', function() {
  var index = $(".playlist-item").index(this);
  loadMediaRef(index, true);
});

function onScrollCondensePlayerView () {

  var topOfPlayer = $("#player").offset().top;
  var heightOfPlayer = $("#player").outerHeight();
  var bottomOfPlayer = topOfPlayer + heightOfPlayer;

  var topOfPlayerContainer = $('#player-container').offset().top;
  var heightOfPlayerContainer = $('#player-container').outerHeight() - 27; // Subtract to prevent page content from jumping
  var bottomOfPlayerContainer = topOfPlayerContainer + heightOfPlayerContainer;

  $(window).scroll(function(){
    if($(window).scrollTop() > (bottomOfPlayer)){
     $("#player-container").addClass('player-condensed');
     $('html').attr('style', 'padding-top: ' + bottomOfPlayerContainer + 'px;' );
    }
    else{
     $("#player-container").removeClass('player-condensed');
     $('html').attr('style', '');
    }
  });

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
          $('#make-clip-podcast input').attr('data-id', selection.id);
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

    $('#make-clip-episode input').attr('data-id', selection.id);
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

function destroyPlayerAndAudio () {
  var audioElArray = $('#player audio');
  if (audioElArray.length > 0) {
    var audioEl = audioElArray[0];
    audioEl.pause();
    audioEl.src = '';
    audioEl.load();
  }
  audio = null;
  $('#player').html('');
}

function addPodcast () {
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

function makeClip () {
  event.preventDefault();

  var podcastId = $('#make-clip-podcast input').attr('data-id');
  if (!isUUID(podcastId)) {
    alert('errrror');
    return;
  }

  var episodeId = $('#make-clip-episode input').attr('data-id');
  if (!isInt(episodeId)) {
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

  if (endTime <= startTime) {
    $('#make-clip-start-time-error').html('End time cannot be earlier than start time.');
    $('#make-clip-start-time').addClass('has-danger');
    $('#make-clip-end-time').addClass('has-danger');
    $('#make-clip-start-time-error').show();
    return;
  }

  // TODO: how can we prevent malicious scripts in the description?
  var description = $('#make-clip-description input').val();

  // TODO: set owner name based on ownerId
  var ownerName = 'random owner name';

  // TODO: handle auth to post clip
  $.ajax({
    type: 'POST',
    url: 'clips',
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
      title: description,
      ownerName: ownerName
    },
    success: function (response) {
      location.href = 'clips\/' + response.id;
    },
    error: function (xhr, status, error) {
      // TODO: add more helpful error messaging
      alert('errrror');
    }

  });

  // TODO: treat enter as tab instead of submit keypress in make clip form

  // TODO: add make clip feature to player pages

  // TODO: view my clips

  // TODO: edit my clips

  // TODO: add CSRF security
}

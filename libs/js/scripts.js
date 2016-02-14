'use strict';

// Podcast / Episode / Clip variables added to the window
// object in player.html

var loadPlaylistItem = function(index) {
  var item = playlistItems[index];

  // Only clips have a startTime and endTime
  startTime = item.startTime;
  endTime = item.endTime;
  isClip = typeof startTime !== "undefined" ? true : false;

  if (isClip === true) {
    clipTitle = item.title;
    duration = item.duration;
    podcastTitle = item.podcast.title;
    podcastImageURL = item.podcast.imageURL;
    episodeTitle = item.episode.title;
    episodeMediaURL = item.episode.mediaURL;
    episodePubDate = item.episode.pubDate;
  } else { // handle item as episode
    clipTitle = "";
    duration = item.duration;
    podcastTitle = item.podcast.title;
    podcastImageURL = item.podcast.imageURL;
    episodeTitle = item.title;
    episodeMediaURL = item.mediaURL;
    episodePubDate = item.pubDate;

    startTime = "0";
    endTime = item.duration;
  }

  window.location.hash = index + 1;

  setPlayerInfo();
  createAndAppendAudio();
}

var setPlayerInfo = function() {
  // Insert content into template differently depending on
  // whether the item is a clip or an episode
  if (isClip === true) {
    $('#player-image img').attr('src', podcastImageURL);
    $('#player-podcast-title').html(podcastTitle);
    $('#player-sub-title').html(episodeTitle);
    $('#player-title').html(clipTitle);
    $('#player-stats-duration').html('Clip:' + duration + ' - ' + startTime + ' to ' + endTime);
    $('#player-stats-listens').html('Listens: 1234');
    $('#player-restart-clip').html('Restart Clip');
    $('#player-restart-clip').css('display', 'block');
  } else {
    $('#player-image img').attr('src', podcastImageURL);
    $('#player-podcast-title').html(podcastTitle);
    $('#player-sub-title').html(episodePubDate);
    $('#player-title').html(episodeTitle);
    $('#player-stats-duration').html('Full Episode');
    $('#player-stats-listens').html('Listens: 1234');
    $('#player-restart-clip').css('display', 'none');
  }

  window.restartAttempts = 0;
  window.lastPlaybackPosition = -1;
  window.endTimeHasBeenReached = false;
}

setPlayerInfo();

var createAndAppendAudio = function() {

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
    // If the lastPlaybackPosition is greater than -1, then the audio player must
    // have crashed and then restarted, and we should resume from the last saved
    // playback position. Else begin from the clip start time.
    if (lastPlaybackPosition > -1) {
      audio.currentTime = lastPlaybackPosition;
    } else {
      console.log(startTime);
      audio.currentTime = startTime || 0;
    }
  };

  audio.oncanplay = function() {
    var autoplay = $.cookie('autoplay');
    if (autoplay === 'On') {
      audio.play();
    }
  }

  audio.ontimeupdate = function() {
    // Stop the clip once when the end time has been reached
    if (Math.floor(audio.currentTime) == endTime && endTimeHasBeenReached == false) {
        endTimeHasBeenReached = true;
        audio.pause();
    }

    // Skip to start time once when the user first hits play on mobile devices
    if (lastPlaybackPosition == -1) {
        audio.currentTime = startTime;
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

var toggleAutoplay = function() {
  var autoplay = $.cookie('autoplay');
  if (autoplay !== 'On') {
    $.cookie('autoplay', 'On');
    $('#player-autoplay').html('Autoplay On');
  } else {
    $.cookie('autoplay', 'Off');
    $('#player-autoplay').html('Autoplay Off');
  }
}

var createAutoplayBtn = function() {
  var autoplay = $.cookie('autoplay');
  if (autoplay === 'Off') {
    $('#player-autoplay').html('Autoplay Off');
  } else {
    $.cookie('autoplay', 'On');
    $('#player-autoplay').html('Autoplay On');
  }
}

// Toggle the autoplay to True by default on page load
// TODO: remove autoplay on mobile devices since they do not support autoplay
createAutoplayBtn();

$(document).ready(function() {
  createAndAppendAudio();
});

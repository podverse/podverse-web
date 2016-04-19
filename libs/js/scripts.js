/*eslint-disable*/
'use strict';

var convertSecToHHMMSS = function(sec) {
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

var readableDate = function(date) {
  return date.substring(0, 10);
}

// Podcast / Episode / Clip variables added to the window
// object in player.html

var loadPlaylistItem = function(index, shouldPlay) {
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
  if (shouldPlay) {
    audio.play();
  }
}

var setPlayerInfo = function() {
  // Insert content into template differently depending on
  // whether the item is a clip or an episode
  isClip = false;

  if (typeof startTime !== "undefined" && startTime > 0) {
    isClip = true;
  }

  if (isClip === true) {
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
  if (autoplay === 'On') {
    $('#player-autoplay').html('Autoplay On');
  } else {
    $.cookie('autoplay', 'Off');
    $('#player-autoplay').html('Autoplay Off');
  }
}

// Toggle the autoplay to True by default on page load
// TODO: remove autoplay on mobile devices since they do not support autoplay
createAutoplayBtn();

$(document).ready(function() {
  createAndAppendAudio();
});

$('.playlist-item').on('click', function() {
  var index = $(".playlist-item").index(this);
  loadPlaylistItem(index, true);
});

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

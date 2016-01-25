'use strict';

var restartAttempts = 0;
var lastPlaybackPosition = -1;
var endTimeHasBeenReached = false;

var mediaURL = window.mediaURL;
var startTime = window.startTime;
var endTime = window.endTime;

var createAndAppendAudio = function() {
  var audio = document.createElement('audio');
  audio.setAttribute('src', mediaURL);
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
      audio.currentTime = startTime;
    }
  };

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

  $('#restart-clip').on('click', function() {
    audio.pause();
    endTimeHasBeenReached = false;
    audio.currentTime = startTime;
    audio.play();
  });

};

$(document).ready(function() {
  createAndAppendAudio();
});

import { calcDuration, convertSecToHHMMSS, isNonAnonLoggedInUser,
         readableDate, recreateAndReinsertElement } from './utility.js';
import { addPlaylistItemTextTruncation } from './playlistHelper.js';
import { subscribeToPodcast, unsubscribeFromPodcast } from './podcastHelper.js';
import { sendGoogleAnalyticsPlayerPageView,
         sendGoogleAnalyticsEvent } from './googleAnalytics.js';

// Set default values for vars that handle player crashes and autoplay functionality
window.restartAttempts = 0;
window.lastPlaybackPosition = -1;
window.endTimeHasBeenReached = false;

// Load the player
if (isEmptyPlaylist !== true) {
  setPlayerInfo();
  // TODO: remove autoplay on mobile devices since they do not support autoplay
  // TODO: or find some kind of way to let autoplay be enabled in mobile browsers
  createAutoplayBtn();
  createAndAppendAudio();
  onScrollCondensePlayerView();
  addPlaylistItemTextTruncation();
} else {
  var isEmptyPlaylistEl = '<div id="empty-playlist-message">This playlist has no episodes or clips added to it. <br><br> Click the <i class="fa fa-list-ul"></i> icon while an episode or clip is playing to add it to a playlist.</div>';
  $(isEmptyPlaylistEl).insertAfter('#player');
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
    podcastTitle = item.episode.podcast.title;
    podcastImageURL = item.episode.podcast.imageURL;
    episodeTitle = item.episode.title;
    episodeMediaURL = item.episode.mediaURL;
    episodePubDate = item.episode.pubDate;
    description = item.title;
    mediaRefId = item.id;
  } else { // handle item as episode
    podcastTitle = item.episode.podcast.title;
    podcastImageURL = item.episode.podcast.imageURL;
    episodeTitle = item.episode.title;
    episodeMediaURL = item.episode.mediaURL;
    episodePubDate = item.episode.pubDate;
    startTime = 0;
    description = item.episode.summary;
    mediaRefId = 'episode_' + item.episode.id;
  }

  window.location.hash = index + 1;

  setPlayerInfo();
  createAndAppendAudio();
  if (shouldPlay) {
    audio.play();
  }

  sendGoogleAnalyticsPlayerPageView();

}

export function previewStartTime (startTime, endTime) {
  window.endTimeHasBeenReached = false;
  window.endTime = endTime;
  audio.currentTime = window.startTime = startTime;
  audio.play();

  sendGoogleAnalyticsEvent('Media Player', 'Preview Start Time');
}

export function previewEndTime (endTime) {
  window.endTimeHasBeenReached = false;
  window.endTime = endTime;
  audio.currentTime = endTime - 3;
  audio.play();

  sendGoogleAnalyticsEvent('Media Player', 'Preview End Time');
}

// NOTE: There has GOT to be a better way to handle truncation than this. Truncation is a
// serious flaw in the UI currently, and it would be worthwhile to rip it all out and replace
// it with something better.
// NOTE: Truncation will fail if you attempt to use it on an element with display:none
// NOTE: Truncation can only be applied once per element. To reapply truncation to an
// element, you need to recreate it and reinsert it into the DOM.
export function truncatePlayerText () {
  recreateAndReinsertElement('player-description-truncated');
  $('#player-description-truncated').on('click', function () {
    $('#player-description-truncated, #player-description-full').toggle();
  });

  recreateAndReinsertElement('player-condensed-title');
  recreateAndReinsertElement('player-condensed-sub-title');
  recreateAndReinsertElement('player-condensed-clip-title');
  recreateAndReinsertElement('player-condensed-podcast-title');
  recreateAndReinsertElement('player-condensed-sub-title');

  $('#player-description-truncated').truncate({ lines: 4 });
  $('#player-condensed-title').truncate({ lines: 1 });
  $('#player-condensed-sub-title').truncate({ lines: 1 });
  $('#player-condensed-clip-title').truncate({ lines: 1 });
  $('#player-condensed-podcast-title').truncate({ lines: 1 });
  $('#player-condensed-sub-title').truncate({ lines: 1 });

}

function setPlayerInfo () {

  if (window.startTime === 0 && window.endTime === null) {
    isEpisode = true;
  } else {
    isEpisode = false;
    endTime = parseInt(window.endTime)
  }

  $('#player').attr('data-id', window.mediaRefId);

  $('#player-header').show();

  if (isEpisode === false) {
    var duration = calcDuration(startTime, endTime);
    $('#player-stats-duration').html(convertSecToHHMMSS(startTime) + ' to ' + convertSecToHHMMSS(endTime));
    $('#player-condensed-clip-time').html(convertSecToHHMMSS(startTime) + ' to ' + convertSecToHHMMSS(endTime));
    $('#player-condensed-clip-title').html(description);
  } else {
    $('#player-stats-duration').html('Full Episode');
  }

  $('#player-condensed-title a').html(podcastTitle);
  $('#player-condensed-title a').attr('href', '/podcasts/' + podcastId);
  $('#player-condensed-sub-title').html(episodeTitle);
  $('#player-condensed-image img').attr('src', podcastImageURL);

  $('#player-podcast-title a').attr('href', '/podcasts/' + podcastId);
  $('#player-podcast-title a').html(podcastTitle);
  $('#player-sub-title').html(episodeTitle);
  $('#player-image a').attr('href', '/podcasts/' + podcastId);
  $('#player-image img').attr('src', podcastImageURL);
  $('#player-stats-pub-date').html(readableDate(episodePubDate));

  $('#player-time-jump-back').html('<i class="fa fa-angle-left"></i> 15s');
  $('#player-time-jump-forward').html('15s <i class="fa fa-angle-right"></i>');
  $('#toggle-make-clip-btn').html('<i class="fa fa-scissors"></i>');
  $('#toggle-playlist-btn').html('<i class="fa fa-list-ul"></i>');
  $('#toggle-recommend-btn').html('<i class="fa fa-user-plus"></i>');

  if ($('#player-hr').length < 1) {
    $('<hr id="player-hr">').insertAfter('#player-functions');
  }

  $('#player-description-truncated').html(description);
  $('#player-description-full').html(description);

  if (episodeImageURL) {
    $('#player-episode-image').html('<img src="' + episodeImageURL + '" class="img-fluid">');
  }

  if (isSubscribed && isSubscribed != 'false') {
    $('#player-podcast-subscribe').html('<i class="fa fa-star"></i>');
    $('#player-podcast-subscribe').attr('title', 'Unsubscribe from podcast');
  } else {
    $('#player-podcast-subscribe').html('<i class="fa fa-star-o"></i>');
    $('#player-podcast-subscribe').attr('title', 'Subscribe to podcast');
  }

  $('#player-podcast-subscribe').on('click', function () {
    if (!isNonAnonLoggedInUser()) {
      alert('Please login to subscribe to this podcast.');
      return;
    }

    if ($(this).children().hasClass('fa-star-o')) {
      $('#player-podcast-subscribe').html('<i class="fa fa-star"></i>');
      $('#player-podcast-subscribe').attr('title', 'Unsubscribe from podcast');
      subscribeToPodcast(podcastId);
    } else {
      $('#player-podcast-subscribe').html('<i class="fa fa-star-o"></i>');
      $('#player-podcast-subscribe').attr('title', 'Subscribe to podcast');
      unsubscribeFromPodcast(podcastId);
    }
  });

  $('#player-description-truncated, #player-description-full').on('click', function () {
    $('#player-description-truncated, #player-description-full').toggle();
  });

  window.restartAttempts = 0;
  window.lastPlaybackPosition = -1;
  window.endTimeHasBeenReached = false;

  var playerWidth = $('#player-inner').width();
  $('#player-condensed-inner').css('width', playerWidth);

  truncatePlayerText();

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
    // the order of controls you want on the control bar (and other plugins below)
    features: ['playpause', 'current', 'progress', 'duration', 'volume', 'fasterslower'],
    alwaysShowHours: true,
    alwaysShowControls: true
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


  // The oncanplaythrough event gets called whenever the currentTime changes.
  // We only want oncanplaythrough to trigger autoplay ONCE when the file first
  // loads, and not when the 15 sec time jump buttons are pressed.
  var autoplayOnceAtBeginning = false;
  audio.oncanplaythrough = function() {
    var autoplay = $.cookie('autoplay');
    if (autoplay === 'true' && autoplayOnceAtBeginning === false) {
      autoplayOnceAtBeginning = true;
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

$('#player-time-jump-forward').on('click', function() {
  audio.currentTime = audio.currentTime + 15;
});

$('#player-time-jump-back').on('click', function() {
  audio.currentTime = audio.currentTime - 15;
});

$('#player-autoplay').on('click', function() {
  toggleAutoplay();
});

function toggleAutoplay () {
  var autoplay = $.cookie('autoplay');
  if (autoplay !== 'true') {
    $.cookie('autoplay', 'true', { path: '/' });
    $('#player-autoplay').html('<span style="font-weight: 500">Autoplay On</span>');
    sendGoogleAnalyticsEvent('Media Player', 'Toggle Autoplay On');
  } else {
    $.cookie('autoplay', 'false', { path: '/' });
    $('#player-autoplay').html('Autoplay Off');
    sendGoogleAnalyticsEvent('Media Player', 'Toggle Autoplay Off');
  }
}

function createAutoplayBtn () {
  var autoplay = $.cookie('autoplay');
  if (autoplay === 'true') {
    $('#player-autoplay').html('<span style="font-weight: 500">Autoplay On</span>');
  } else {
    $.cookie('autoplay', 'false', { path: '/' });
    $('#player-autoplay').html('Autoplay Off');
  }
}

function restart () {
  audio.pause();
  endTimeHasBeenReached = false;
  audio.currentTime = startTime;
  audio.play();
  sendGoogleAnalyticsEvent('Media Player', 'Restart');
}

$('#player-stats-duration').on('click', function () {
  restart();
});

$('.playlist-item').on('click', function() {
  if (isPlayerPage) {
    var index = $(".playlist-item").index(this);
    loadMediaRef(index, true);
    sendGoogleAnalyticsEvent('Media Player', 'Playlist Item Clicked');
  }
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
     $('html').attr('style', 'padding-top: ' + bottomOfPlayerContainer + 'px;' );

     truncatePlayerText();

    //  $('#player-condensed-text').css('position', 'initial');
    $('#player-container').addClass('condensed');

    } else {
     $('html').attr('style', '');
     $('#player-container').removeClass('condensed');

    //  $('#player-condensed-text').css('position', 'absolute');
    }
  });

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

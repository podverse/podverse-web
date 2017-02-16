import { calcDuration, convertSecToHHMMSS, debounce, isNonAnonLoggedInUser,
         readableDate } from './utility.js';
import { subscribeToPodcast, unsubscribeFromPodcast } from './podcastHelper.js';
import { sendGoogleAnalyticsPlayerPageView,
         sendGoogleAnalyticsEvent } from './googleAnalytics.js';
import { isMobileOrTablet } from './browserSupportDetection.js';

// Disable zoom for iOS 10+ since user-scalable metatag doesn't work anymore.
// Thanks Joseph! http://stackoverflow.com/a/38573198/2608858
document.documentElement.addEventListener('touchstart', function (event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, false);
var lastTouchEnd = 0;
document.documentElement.addEventListener('touchend', function (event) {
  var now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);


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
  checkIfEpisodeMediaFileIsFound(createAndAppendAudio, showEpisodeNotFoundMessage);
  onScrollCondensePlayerView();
} else {
  var isEmptyPlaylistEl = '<div id="empty-playlist-message">This playlist has no episodes or clips added to it.';
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

  podcastTitle = item.podcastTitle;
  podcastImageURL = item.podcastImageURL;
  episodeTitle = item.episodeTitle;
  episodeMediaURL = item.episodeMediaURL;
  episodePubDate = item.episodePubDate;
  description = item.title;
  isSubscribed = item.isSubscribed;
  mediaRefId = item.id;

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

function setPlayerInfo () {

  if (window.startTime === 0 && window.endTime === null) {
    isEpisode = true;
  } else {
    isEpisode = false;
    endTime = parseInt(window.endTime)
  }

  $('#player').attr('data-id', window.mediaRefId);

  $('#player-header').show();

  let startTimeReadable = '',
      endTimeReadable = '';

  if (endTime >= 0 && endTime !== null) {
    startTimeReadable = 'Clip: ' + convertSecToHHMMSS(startTime);
    endTimeReadable = ' to ' + convertSecToHHMMSS(endTime);
  } else {
    startTimeReadable = 'Clip: ' + convertSecToHHMMSS(startTime);
    endTimeReadable = ' start time';
  }

  if (isEpisode === false) {
    var duration = calcDuration(startTime, endTime);
    $('#player-stats-duration').html(startTimeReadable + endTimeReadable);
    $('#player-condensed-text').html(startTimeReadable + endTimeReadable + ' – ' + description);
    $('#player-condensed-text').addClass('should-show');
  } else {
    $('#player-stats-duration').html('Full Episode');
  }

  if (isPlaylist && !isEpisode) {
    $('#player-stats-duration-link').html('<a href="/clips/' + mediaRefId + '"><i class="fa fa-link"></i></a>')
  } else if (isPlaylist && isEpisode) {
    $('#player-stats-duration-link').html('<a href="/episodes/alias?mediaURL=' + episodeMediaURL + '"><i class="fa fa-link"></i></a>')
  }

  $('#player-condensed-title a').html(podcastTitle);
  $('#player-condensed-title a').attr('href', '/podcasts?feedURL=' + podcastFeedURL);
  $('#player-condensed-sub-title').html(episodeTitle);
  $('#player-condensed-image img').attr('src', podcastImageURL);

  $('#player-podcast-title a').attr('href', '/podcasts/alias?feedURL=' + podcastFeedURL);
  $('#player-podcast-title a').html(podcastTitle);

  $('#player-sub-title a').attr('href', '/episodes/alias?mediaURL=' + episodeMediaURL);
  $('#player-sub-title a').html(episodeTitle);

  $('#player-image a').attr('href', '/podcasts?feedURL=' + podcastFeedURL);
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

  if (description) {
    let truncDescription = description.substring(0, 286);

    // Add "show more" if description was truncated
    if (truncDescription.length > 285) {
      // If last character is a space, remove it
      if(/\s+$/.test(truncDescription)) {
        truncDescription = truncDescription.slice(0,-1)
      }

      truncDescription += "... <span class='text-primary'><small>show more</small></span>";
    }

    description += '<hr>';
    truncDescription += '<hr>';

    $('#player-description-truncated').html(truncDescription);
    $('#player-description-full').html(description);

    $('#player-description-truncated').show();
    $('#player-description-full').hide();

    $('#player-description-truncated').on('click', () => {
      $('#player-description-truncated').hide();
      $('#player-description-full').show();
    })
  }

  if (isSubscribed && isSubscribed != 'false') {
    $('#player-podcast-subscribe').html('<i class="fa fa-star"></i>');
    $('#player-podcast-subscribe').attr('title', 'Unsubscribe from podcast');
  } else {
    $('#player-podcast-subscribe').html('<small>subscribe</small> <i class="fa fa-star-o"></i>');
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
      subscribeToPodcast(podcastFeedURL);
    } else {
      $('#player-podcast-subscribe').html('<small>subscribe</small> <i class="fa fa-star-o"></i>');
      $('#player-podcast-subscribe').attr('title', 'Subscribe to podcast');
      unsubscribeFromPodcast(podcastFeedURL);
    }
  });

  window.restartAttempts = 0;
  window.lastPlaybackPosition = -1;
  window.endTimeHasBeenReached = false;

  var playerWidth = $('#player-inner').width();
  $('#player-condensed-inner').css('width', playerWidth);

  let updateCondensedPlayerWidth = debounce(function () {
    var playerWidth = $('#player-inner').width();
    $('#player-condensed-inner').css('width', playerWidth);
    setTimeout(function () {
      resizeProgressBar();
    }, 200);
  }, 200);

  window.addEventListener('resize', updateCondensedPlayerWidth);

}

// Super-hack to fix the JS dynamically styled progress bar when it breaks after
// screen resize.
function resizeProgressBar () {
  // Progress bar width should be equal to width of #player minus the total space
  // taken up by all other elements in the #player element, *except* on mobile
  // when the volume bar elements do not load in the player.
  var hasVolumeBar = ($('.mejs-horizontal-volume-slider').width() > 0);
  var otherElementsWidth = 176 + (hasVolumeBar ? 82 : 0);
  var newWidth = $('#player').width() - otherElementsWidth;
  $('.mejs-time-rail').width(newWidth);
  $('.mejs-time-slider').width(newWidth - 10);
}

function checkIfEpisodeMediaFileIsFound(success, error) {
  window.audio = document.createElement('audio');
  audio.setAttribute('src', episodeMediaURL);
  audio.setAttribute('type', 'audio/mpeg');
  audio.setAttribute('codecs', 'mp3');
  audio.preload = "metadata";

  audio.onloadstart = function() {
    success();
  };

  audio.onerror = function () {
    error();
  }
}

function showEpisodeNotFoundMessage () {
  $('#player-functions').hide();
  $('#player-error-message').html(`
    <p>
      Episode Not Found: this episode may no longer be publicly available,
      or there was a network connectivity issue.
    </p>
  `);
  $('#player-error-message').show();
}

function createAndAppendAudio () {
  // If a new media file is loaded, reappend audio element
  if (episodeMediaURL !== previousEpisodeMediaURL) {
    window.previousEpisodeMediaURL = episodeMediaURL;
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

  }

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

      var autoplay = $.cookie('autoplay');
      if (isPlaylist && autoplay === 'true') {
        if (urlHashIndexValue < mediaRefs.length - 1) {
          urlHashIndexValue++;
          window.location.hash = urlHashIndexValue;
          lastPlaybackPosition = -1;
          loadMediaRef(urlHashIndexValue, true)
          return;
        }
      }
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
  if (!isMobileOrTablet()) {
    var autoplay = $.cookie('autoplay');
    if (autoplay === 'true') {
      $('#player-autoplay').html('<span style="font-weight: 500">Autoplay On</span>');
    } else {
      $.cookie('autoplay', 'false', { path: '/' });
      $('#player-autoplay').html('Autoplay Off');
    }
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
    urlHashIndexValue = index;
    loadMediaRef(index, true);
    sendGoogleAnalyticsEvent('Media Player', 'Playlist Item Clicked');
  }
});

function onScrollCondensePlayerView () {

  var topOfPlayer = $("#player").offset().top;
  var heightOfPlayer = $("#player").outerHeight();
  var bottomOfPlayer = topOfPlayer + heightOfPlayer;

  var topOfPlayerContainer = $('#player-container').offset().top;
  // -145 to prevent screen from jumping when switching to a condensed view
  // HACK: we shouldn't need something like this, remove after refactoring player /  condensed player
  var heightOfPlayerContainer = $('#player-container').outerHeight() - 145;
  var bottomOfPlayerContainer = topOfPlayerContainer + heightOfPlayerContainer;

  let condenseOnScroll = debounce(function () {
    if($(window).scrollTop() > (bottomOfPlayer)){
     $('html').attr('style', 'padding-top: ' + bottomOfPlayerContainer + 'px;' );

     $('#player-container').addClass('condensed');

    } else {
     $('html').attr('style', '');
     $('#player-container').removeClass('condensed');
    }
  }, 20)

  window.addEventListener('scroll', condenseOnScroll);

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

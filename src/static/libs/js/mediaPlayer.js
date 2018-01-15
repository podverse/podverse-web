import { calcDuration, convertSecToHHMMSS, throttle, isNonAnonLoggedInUser,
         readableDate, secondsToReadableDuration, checkIfiOSBrowser } from './utility.js';
import { subscribeToPodcast, unsubscribeFromPodcast } from './podcastHelper.js';
import { requestPaginatedClipsFromAPI } from './clipHelper.js';
import { sendGoogleAnalyticsPlayerPageView,
         sendGoogleAnalyticsEvent } from './googleAnalytics.js';
import { isMobileOrTablet } from './browserSupportDetection.js';
import { allowedFilters, isFilterAllowed } from '../../../constants.js';
const he = require('he');
const Autolinker = require('autolinker');
const stripTags = require('striptags');


// Set default values for vars that handle player crashes and autoplay functionality
window.restartAttempts = 0;
window.lastPlaybackPosition = -1;
window.endTimeHasBeenReached = false;

// Load the player
if (isEmptyPlaylist !== true) {
  $('#player').append('<i class="fa fa-spinner fa-spin"></i>');

  if (isNonAnonLoggedInUser()) {
    $('#toggle-playlist-btn').css('display', 'inline-block');
  }

  setPlayerInfo();
  setSubscribedStatus();
  createAutoplayBtn();
  checkIfEpisodeMediaFileIsFound(createAndAppendAudio, showEpisodeNotFoundMessage);
  onScrollCondensePlayerView();
} else {
  var isEmptyPlaylistEl = '<div id="empty-playlist-message">This playlist has no episodes or clips added to it.</div>';
  $(isEmptyPlaylistEl).insertAfter('#player');
}

if (!isPlaylist) {
  let params = {};
  params.podcastFeedUrls = [window.podcastFeedUrl];
  params.filterType = 'pastMonth';

  var spinnerEl = $('<div class="load-clips-spinner"><i class="fa fa-spinner fa-spin"><i></div>');
  $(spinnerEl).insertAfter('#playlist .sort-by-dropdown.dropdown');

  requestPaginatedClipsFromAPI(params)
  .then(page => {
    let clips = page.data;
    $(spinnerEl).remove();
    loadClipsAsPlaylistItems(clips);
  })
  .catch(err => {
    console.log(err);
    $(spinnerEl).remove();
  });
} else {
  setPlaylistItemClickEvents();
}

function loadClipsAsPlaylistItems (clips) {
  $('#playlist .playlist-item').remove();

  let html  = '';

  for (let clip of clips) {

    let truncTitle = clip.title;
    if (clip.title && clip.title.length > 340) {
      truncTitle = clip.title.substr(0, 340);
      truncTitle += '...';
    }

    html += `<div class="playlist-item" data-media-ref-id="${clip.id}" tabindex="0">`;
    html +=   '<div class="playlist-item-title">';
    html +=     truncTitle || clip.title;
    html +=   '</div>';
    html +=   '<div class="playlist-item-date">';
    html +=     readableDate(clip.episodePubDate);
    html +=   '</div>';
    html +=   '<div class="playlist-item-episode-title">'
    html +=     clip.episodeTitle;
    html +=   '</div>';
    html +=   '<div class="playlist-item-duration">';
    if (clip.endTime) {
      html += secondsToReadableDuration(clip.endTime - clip.startTime);
    }
    html +=   '</div>'
    html +=   '<div class="playlist-item-time">'
    html +=   'Clip: ' + convertSecToHHMMSS(clip.startTime);
    if (clip.endTime) {
      html +=   ' - ' + convertSecToHHMMSS(clip.endTime);
    } else {
      html +=   ' start'
    }
    html +=   '</div>';
    html +=   '<div class="clearfix"></div>';
    html += '</div>';
  }

  // the window.mediaRefs object is needed in the .playlist-item click event
  window.mediaRefs = clips.reverse();

  $('#playlist').append(html);

  setTimeout(function() {
    setPlaylistItemClickEvents();
  }, 1000);
}



// Podcast / Episode / Clip variables added to the window
// object in player.html

window.loadPlaylistItem = (index) => {
  $('#player-error-message').hide();

  var item = mediaRefs[index];

  window.setPlaylistItemPropsOnWindow(item);

  setPlayerInfo();
  setSubscribedStatus();

  if (episodeMediaUrl !== previousEpisodeMediaUrl) {
    destroyPlayerAndAudio();
    checkIfEpisodeMediaFileIsFound(createAndAppendAudio, showEpisodeNotFoundMessage);
  } else {
    audio.currentTime = startTime;

    var autoplay = $.cookie('autoplay');
    if (autoplay === 'true') {
      audio.play();
    }
  }

  // If not on playlist page (instead on a clip or episode page),
  // then rewrite URL in search bar so the user is able to share the
  // correct link.
  if (!isPlaylist) {
    if (isEpisode) {
      window.history.pushState({}, '', `/episodes/${item.id}`);
    } else {
      window.history.pushState({}, '', `/clips/${item.id}`);
    }
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

  $('#add-to-playlist').hide();
  $('#toggle-playlist-btn').removeClass('active');
  $('#make-clip').hide();
  $('#toggle-make-clip-btn').removeClass('active');
  $('#make-clip-end-time input').val('');
  $('#make-clip-title textarea').val('');

  if (window.startTime === 0 && window.endTime === null && !(window.startTimeOverride)) {
    isEpisode = true;
  } else {
    isEpisode = false;
    endTime = parseInt(window.endTime)
  }

  document.getElementById('player').setAttribute('data-id', window.mediaRefId);

  $('#player-header').show();

  $('#player-condensed-title a').html(podcastTitle);
  $('#player-condensed-title a').attr('href', '/podcasts/alias?feedUrl=' + podcastFeedUrl);
  $('#player-condensed-sub-title a').attr('href', '/episodes/alias?mediaUrl=' + episodeMediaUrl);
  $('#player-condensed-sub-title a').html(episodeTitle);
  $('#player-condensed-image img').attr('src', podcastImageUrl);

  $('#player-podcast-title a').attr('href', '/podcasts/alias?feedUrl=' + podcastFeedUrl);
  podcastTitle = he.decode(podcastTitle);
  $('#player-podcast-title a').html(podcastTitle);

  $('#player-sub-title a').attr('href', '/episodes/alias?mediaUrl=' + episodeMediaUrl);
  $('#player-sub-title a').html(episodeTitle);

  $('#player-image a').attr('href', '/podcasts/alias?feedUrl=' + podcastFeedUrl);
  $('#player-image img').attr('src', podcastImageUrl);
  $('#player-pub-date').html(readableDate(episodePubDate));

  $('#player-time-jump-back').html('<i class="fa fa-angle-left"></i> 15s');
  $('#player-time-jump-forward').html('15s <i class="fa fa-angle-right"></i>');
  $('#toggle-make-clip-btn').html('<i class="fa fa-scissors"></i>');
  $('#toggle-share-btn').html('<i class="fa fa-share"></i>');
  $('#toggle-support-btn').html('<i class="fa fa-money"></i>');
  $('#toggle-playlist-btn').html('<i class="fa fa-list-ul"></i>');

  if ($('#player-hr').length < 1) {
    $('<hr id="player-hr">').insertAfter('#player-functions');
  }

  let truncDescription = description;
  truncDescription = stripTags(truncDescription);
  truncDescription = truncDescription.trim();

  if (!description || description.length === 0) {
    if (isEpisode) {
      truncDescription = description = '<i>No episode summary provided</i>';
    } else {
      truncDescription = description = '<i>No clip title provided</i>';
    }
  }

  $('#player-description-truncated').html(truncDescription);

  let startTimeReadable = '',
      endTimeReadable = '';

  if (endTime >= 0 && endTime !== null) {
    startTimeReadable = convertSecToHHMMSS(startTime);
    endTimeReadable = ' - ' + convertSecToHHMMSS(endTime);
  } else {
    startTimeReadable = convertSecToHHMMSS(startTime);
  }

  $('#player-clip-time').html('Clip: ' + startTimeReadable + endTimeReadable);

  if (endTime) {
    let dur = calcDuration(startTime, endTime);
    $('#player-clip-duration').html(secondsToReadableDuration(dur));
  }

  description = `<p>${episodeTitle}</p>`;
  description += `<p>${episodeSummary}</p>`;

  let autolinker = new Autolinker({});
  description = autolinker.link(description);

  $('#player-description-full').html(description);

  // Strip any img tags served over http://, since they won't load on https://podverse.fm
  $('#player-description-full img').each(function() {
    let src = $(this).attr('src');
    if (src && src.indexOf('http://') > -1) {
      $(this).remove();
    }
  });

  $('#player-description-truncated').html(truncDescription);

  $('#player-description-show-more').html(`<span class="text-primary">Show Notes</span>`);

  if (isEpisode === false) {
    $('#player-clip-time').show();
    $('#player-description-truncated').show();
    $('#player-description-full').hide();
    $('#player-description-show-more').show();
    $('#player-condensed-text').html(truncDescription);
    $('#player-condensed-text').addClass('should-show');
    $('#player-condensed-time').html('Clip: ' + startTimeReadable + endTimeReadable);
    $('#player-condensed-time').addClass('should-show');
  } else {
    $('#player-description-truncated').hide();
    $('#player-description-full').show();
    $('#player-condensed-text').removeClass('should-show');
    $('#player-condensed-time').removeClass('should-show');
  }

  $('#playlist').show();

  window.restartAttempts = 0;
  window.lastPlaybackPosition = -1;
  window.endTimeHasBeenReached = false;

  var playerWidth = $('#player-inner').width();
  $('#player-condensed-inner').css('width', playerWidth);

  let updateCondensedPlayerWidth = throttle(function () {
    var playerWidth = $('#player-inner').width();
    $('#player-condensed-inner').css('width', playerWidth);
    setTimeout(function () {
      resizeProgressBar();
    }, 200);
  }, 200);

  window.addEventListener('resize', updateCondensedPlayerWidth);

}

// Sometimes when returning from the lock screen to a player page in iOS Safari
// the media player progress bar loads with too much width. These event listeners
// are attempts to handle this issue.
window.addEventListener('focus', resizeProgressBar);
window.addEventListener('pageshow', resizeProgressBar);
window.addEventListener('visibilityChange', resizeProgressBar);

let isTruncated = false;
$('#player-description-truncated').on('click', () => {
  if (isTruncated) {
    $('#player-description-truncated').css({
      'text-overflow': 'initial',
      'white-space': 'normal'
    });
  } else {
    $('#player-description-truncated').css({
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap'
    });
  }
  isTruncated = !isTruncated;
});

$('#player-description-show-more').on('click', () => {
  if ($('#player-description-show-more').html() === '<span class="text-primary">Hide Notes</span>') {
    $('#player-description-show-more').html(`<span class="text-primary">Show Notes</span>`);
    $('#player-description-full').hide();
  } else {
    $('#player-description-show-more').html(`<span class="text-primary">Hide Notes</span>`);
    $('#player-description-full').show();
  }
});

$('#player-clip-time').on('click', () => {
  restart();
});

function setSubscribedStatus() {

  $.ajax({
    type: 'GET',
    url: '/podcasts/isSubscribed',
    headers: {
      Authorization: $.cookie('idToken')
    },
    data: {
      podcastFeedUrl: podcastFeedUrl
    },
    success: function (isSubscribed) {
      if (isSubscribed && isSubscribed != 'false') {
        $('#player-podcast-subscribe').html('<i class="fa fa-star"></i>');
        $('#player-podcast-subscribe').attr('title', 'Unsubscribe from podcast');
      } else {
        $('#player-podcast-subscribe').html('<i class="fa fa-star-o"></i>');
        $('#player-podcast-subscribe').attr('title', 'Subscribe to podcast');
      }
    },
    error: function (xhr, status, error) {
      $('#player-podcast-subscribe').html('<i class="fa fa-star-o"></i>');
      $('#player-podcast-subscribe').attr('title', 'Subscribe to podcast');
    }
  });
}

function toggleSubscribe() {
  if (!isNonAnonLoggedInUser()) {
    alert('Login to subscribe to this podcast.');
    return;
  }

  // var index = $(".playlist-item").index(this);

  if ($('#player-podcast-subscribe i').hasClass('fa-star-o')) {
    $('#player-podcast-subscribe').html('<i class="fa fa-star"></i>');
    $('#player-podcast-subscribe').attr('title', 'Unsubscribe from podcast');
    subscribeToPodcast(podcastFeedUrl);
    // if (window.mediaRefs) {
    //   window.mediaRefs[index]["isSubscribed"] = true;
    // }
  } else {
    $('#player-podcast-subscribe').html('<i class="fa fa-star-o"></i>');
    $('#player-podcast-subscribe').attr('title', 'Subscribe to podcast');
    unsubscribeFromPodcast(podcastFeedUrl);
    // if (window.mediaRefs) {
    //   window.mediaRefs[index]["isSubscribed"] = false;
    // }
  }
}

$('#player-podcast-subscribe').on('click', function () {
  toggleSubscribe(this);
});

// Super-hack to fix the JS dynamically styled progress bar when it breaks after
// screen resize.
function resizeProgressBar () {
  // Progress bar width should be equal to width of #player minus the total space
  // taken up by all other elements in the #player element, *except* on mobile
  // when the volume bar elements do not load in the player, also the prev / next
  // buttons only load on playlist pages.
  var hasVolumeBar = ($('.mejs-horizontal-volume-slider').width() > 0);
  var otherElementsWidth = 228 + (hasVolumeBar ? 82 : 0) - (isPlaylist ? 0 : 52);
  var newWidth = $('#player').width() - otherElementsWidth;
  $('.mejs-time-rail').width(newWidth);
  $('.mejs-time-slider').width(newWidth - 10);
}

function checkIfEpisodeMediaFileIsFound(success, error) {
  window.audio = document.createElement('audio');
  audio.setAttribute('src', episodeMediaUrl);
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
  if (episodeMediaUrl !== previousEpisodeMediaUrl) {
    window.previousEpisodeMediaUrl = episodeMediaUrl;
    // If audio player elements are already on the page, remove them first.
    $('.mejs-offscreen').remove();
    $('.mejs-container').remove();

    $('#player .fa-spinner').show();

    window.audio = document.createElement('audio');
    audio.setAttribute('src', episodeMediaUrl);
    audio.setAttribute('type', 'audio/mpeg');
    audio.setAttribute('codecs', 'mp3');
    audio.setAttribute('title', episodeTitle + ' – ' + podcastTitle);
    audio.preload = "metadata";
  }



  // NOTE: this audio.oncanplay is needed to work around an iOS Safari 11.0.2 playback failure bug,
  // but this hacky workaround also causes all Mac Sierra browsers to crash, so
  // we're only setting the oncanplay method if we detect the device is iOS.
  if (checkIfiOSBrowser()) {
    audio.oncanplay = function () {
      audio.currentTime = window.startTime || 0;
    }
  }

  audio.onloadedmetadata = function() {
    // NOTE: setting the currentTime in oncanplay AND onloadedmetadata
    // is required to work around an iOS Safari 11.0.2 bug.
    audio.currentTime = window.startTime || 0;

    $('#player .fa-spinner').hide();

    $('#player').append(audio);

    let playerFeatures;

    if (window.isPlaylist) {
      playerFeatures = ['playpause', 'current', 'progress', 'duration', 'volume', 'fasterslower',
      'prevtrack', 'nexttrack'];
    } else {
      playerFeatures = ['playpause', 'current', 'progress', 'duration', 'volume', 'fasterslower'];
    }

    $('audio').mediaelementplayer({
      // the order of controls you want on the control bar (and other plugins below)
      features: playerFeatures,
      alwaysShowHours: true,
      alwaysShowControls: true,
      startVolume: 1.0
    });
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
    setStartAndEndTimesToBePlayed();
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

$('#make-clip .dropdown-item').on('click', function () {
  let _this = this;
  // surrounding in setTimeout to override the default behavior of the bootstrap dropdown select behavior
  setTimeout(function () {
    if ($(_this).attr('id') === 'isPublic') {
      $('#makeClipPrivacyButton').html('<i class="fa fa-globe"></i> Public <i class="fa fa-angle-down"></i>');
      $('#make-clip-share-settings').html('<i class="fa fa-globe"></i> <span>Public:</span> <i>clip may appear anywhere on the site</i>')
    } else {
      $('#makeClipPrivacyButton').html('<i class="fa fa-link"></i> Only with link <i class="fa fa-angle-down"></i>');
      $('#make-clip-share-settings').html('<i class="fa fa-link"></i> <span>Only with link:</span> <i>clip is visible to anyone with the link</i>')
    }
  }, 10);
});

$(document).keydown(function(e){
    if ($(e.target).is('input, textarea')) {
      return;
    }

    if (e.keyCode == 37) { // left arrow
      audio.currentTime = audio.currentTime - 5;
      return false;
    }
    if (e.keyCode == 39) { // right arrow
      audio.currentTime = audio.currentTime + 5;
      return false;
    }
});

function setStartAndEndTimesToBePlayed() {
  // Stop the clip once when the end time has been reached
  if (Math.floor(audio.currentTime) === endTime && endTimeHasBeenReached === false) {
    endTimeHasBeenReached = true;
    audio.pause();

    var autoplay = $.cookie('autoplay');
    if (isPlaylist && autoplay === 'true') {
      if (nowPlayingPlaylistItemIndex < mediaRefs.length - 1) {
        nowPlayingPlaylistItemIndex++;
        lastPlaybackPosition = -1;
        loadPlaylistItem(nowPlayingPlaylistItemIndex)
        return;
      }
    }
  }

  // TODO: Can this be made more efficient than rewriting the lastPlaybackPosition
  // whenever time updates?
  lastPlaybackPosition = audio.currentTime;
}

function toggleAutoplay () {
  var autoplay = $.cookie('autoplay');
  if (autoplay !== 'true') {
    $.cookie('autoplay', 'true', {
      path: '/',
      expires: 365
    });
    $('#player-autoplay').html('<span style="font-weight: 500">Autoplay On</span>');
    sendGoogleAnalyticsEvent('Media Player', 'Toggle Autoplay On');
  } else {
    $.cookie('autoplay', 'false', {
      path: '/',
      expires: 365
    });
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
      $.cookie('autoplay', 'false', {
        path: '/',
        expires: 365
      });
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

function setPlaylistItemClickEvents() {
  $('.playlist-item').on('keypress click', function(e) {
    if (e.which === 13 || e.type === 'click') {
      if (isPlayerPage) {
        if (!$(this).hasClass("edit-view")) {
          $('#player-description-truncated').css({
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap'
          });
          isTruncated = true;

          var index = $(".playlist-item").index(this);
          index = mediaRefs.length - index - 1;
          nowPlayingPlaylistItemIndex = index;
          loadPlaylistItem(index);
          sendGoogleAnalyticsEvent('Media Player', 'Playlist Item Clicked');
        }
      }
    }
  });

  $('#playlist .sort-by-dropdown .dropdown-item').on('click', function (_this) {
    if (_this && _this.target) {
      let params = {};
      params.podcastFeedUrls = [window.podcastFeedUrl];
      // params.episodeMediaUrl = episodeMediaUrl;
      params.filterType = _this.target.id;
      $('#playlist .sort-by-dropdown button').html(_this.target.innerText + ' <i class="fa fa-angle-down"></i>');
      requestPaginatedClipsFromAPI(params)
      .then(page => {
        let clips = page.data;
        loadClipsAsPlaylistItems(clips);
      })
      .catch(err => console.log(err));
    }
  });
}

function onScrollCondensePlayerView () {

  var topOfPlayer = $("#player").offset().top;
  var heightOfPlayer = $("#player").outerHeight();
  var bottomOfPlayer = topOfPlayer + heightOfPlayer;

  var topOfPlayerContainer = $('#player-container').offset().top;
  // -145, -17 to prevent screen from jumping when switching to a condensed view
  // HACK: we shouldn't need something like this, remove after refactoring player /  condensed player
  var heightOfPlayerContainer = $('#player-container').outerHeight() - 145;
  var bottomOfPlayerContainer = topOfPlayerContainer + heightOfPlayerContainer;

  let condenseOnScroll = throttle(function () {
    if($(window).scrollTop() > (bottomOfPlayer)){
     $('html').attr('style', 'padding-top: ' + (bottomOfPlayerContainer - 17) + 'px;' );

     $('#player-container').addClass('condensed');

    } else {
     $('html').attr('style', '');
     $('#player-container').removeClass('condensed');
    }
  }, 20);

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
  $('#player').append('<i class="fa fa-spinner fa-spin"></i>');
}

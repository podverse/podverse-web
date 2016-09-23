/*eslint-disable*/
'use strict';

// Set default values for vars that handle player crashes and autoplay functionality
window.restartAttempts = 0;
window.lastPlaybackPosition = -1;
window.endTimeHasBeenReached = false;

// If user is a logged-in non-anonymous user, display different navbar buttons
if (localStorage.getItem('nickname')) {
  appendLoggedInUserNavButtons();
} else {
  appendNonLoggedInUserNavButtons();
}

function appendLoggedInUserNavButtons () {

  $('#login-btn').addClass('btn-group');

  var navDropdownButtonString =   '<a class="dropdown-toggle nav-link hidden-xs-down" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +  localStorage.getItem('nickname') +'</a>';
      navDropdownButtonString +=  '<div class="dropdown-menu hidden-xs-down" aria-labelledby="dropdownMenu1">';
      navDropdownButtonString +=    '<a class="dropdown-item" href="/settings">Settings</a>';
      navDropdownButtonString +=    '<hr style="display: block;" />';
      navDropdownButtonString +=    '<a class="dropdown-item" href="/logout">Logout</a>';
      navDropdownButtonString +=  '</div>';

  $('#login-btn').html(navDropdownButtonString);

  var navButtonString =   '<li class="nav-item">';
      navButtonString +=    '<a id="navbar-search-icon" class="nav-link hidden-xs-down" href="#" data-toggle="modal" data-target="#navbarSearchModal"><i class="fa fa-search"></i></a>';
      navButtonString +=  '</li>';
      navButtonString +=   '<li class="nav-item">';
      navButtonString +=    '<a class="nav-link hidden-xs-down" href="#">Podcasts</a>';
      navButtonString +=  '</li>';
      navButtonString +=  '<li class="nav-item">';
      navButtonString +=    '<a class="nav-link hidden-xs-down" href="#">Clips</a>';
      navButtonString +=  '</li>';
      navButtonString +=  '<li class="nav-item">';
      navButtonString +=    '<a class="nav-link hidden-xs-down" href="#">Playlists</a>';
      navButtonString +=  '</li>';

  $(navButtonString).insertAfter('#login-btn');

  var navMobileMenuString =   '<a class="nav-link hidden-sm-up" href="#">Podcasts</a>';
      navMobileMenuString +=  '<a class="nav-link hidden-sm-up" href="#">Clips</a>';
      navMobileMenuString +=  '<a class="nav-link hidden-sm-up" href="#">Playlists</a>';
      navMobileMenuString +=  '<a class="nav-link hidden-sm-up" href="#">Settings</a>';
      navMobileMenuString +=  '<hr class="hidden-sm-up">';
      navMobileMenuString +=  '<a class="nav-link hidden-sm-up" href="#">Logout</a>';

  $(navMobileMenuString).insertAfter('#login-btn');
}

function appendNonLoggedInUserNavButtons () {
  $('#login-btn').html('<a class="nav-link" onclick="lock.show();">Login</a>');
}

function calcDuration (startTime, endTime) {
  if (endTime > startTime) {
    return endTime - startTime;
  } else {
    return;
  }
}

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
  } else if (minutes === 0 && hours > 0) {
    result +=  '00:';
  }

  if (seconds > 9) {
    result += seconds;
  } else if (seconds > 0 && minutes > 0) {
    result += '0' + seconds;
  } else if (seconds > 0) {
    result += seconds;
  } else {
    result += '00';
  }

  return result
}

function readableDate (date) {
  // Thanks:) http://stackoverflow.com/questions/19485353/function-to-convert-timestamp-to-human-date-in-javascript
  var dateObj = new Date(date),
  year = dateObj.getFullYear(),
  month = dateObj.getMonth() + 1,
  day = dateObj.getDate();

  return month+'/'+day+'/'+year;
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

function addPlaylistItemTextTruncation() {
  var playlistItems = document.getElementsByClassName('playlist-item');

  for (var i = 0; i < playlistItems.length; i++) {
    var playlistItemPodcastTitle = playlistItems[i].getElementsByClassName('playlist-item-podcast-title');
    var playlistItemSubTitle = playlistItems[i].getElementsByClassName('playlist-item-sub-title');
    var playlistItemDetails = playlistItems[i].getElementsByClassName('playlist-item-details');
    $clamp(playlistItemPodcastTitle[0], {clamp: 1});
    $clamp(playlistItemSubTitle[0], {clamp: 1});
    $clamp(playlistItemDetails[0], {clamp: '57px'});
  }
}

function loadPodcastSearchTypeahead() {
  var podcastResults = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: 'http://localhost:8080/podcasts?title=%QUERY',
      wildcard: '%QUERY'
    }
  });

  $('#navbarSearchModalInput').typeahead({
    hint: false,
    highlight: true,
    minLength: 1
  }, {
    name: 'podcasts',
    display: 'title',
    source: podcastResults
  }).on('typeahead:selected typeahead:autocomplete', function (event, selection) {
    window.location.href = '/podcasts/' + selection.id;
  });
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
    duration = item.duration;
    podcastTitle = item.episode.podcast.title;
    podcastImageURL = item.episode.podcast.imageURL;
    episodeTitle = item.episode.title;
    episodeMediaURL = item.episode.mediaURL;
    episodePubDate = item.episode.pubDate;
    description = item.description;
  } else { // handle item as episode
    duration = item.duration;
    podcastTitle = item.episode.podcast.title;
    podcastImageURL = item.episode.podcast.imageURL;
    episodeTitle = item.episode.title;
    episodeMediaURL = item.episode.mediaURL;
    episodePubDate = item.episode.pubDate;
    startTime = 0;
    description = item.episode.summary;
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

  $clamp(document.getElementById('player-condensed-title'), {clamp: 1});
  $clamp(document.getElementById('player-condensed-sub-title'), {clamp: 1});
  $clamp(document.getElementById('player-podcast-title'), {clamp: 1});
  $clamp(document.getElementById('player-sub-title'), {clamp: 1});

  $('#player-header').show();

  if (isEpisode === false) {
    var duration = calcDuration(startTime, endTime);
    $('#player-stats-duration').html(convertSecToHHMMSS(startTime) + ' to ' + convertSecToHHMMSS(endTime));
    $('#player-condensed-sub-title').html(description);
  } else {
    $('#player-stats-duration').html('Full Episode');
    $('#player-condensed-sub-title').html(episodeTitle);
  }

  $('#player-condensed-title a').html(podcastTitle);
  $('#player-condensed-title a').attr('href', '/podcasts/' + podcastId);

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
  $('#toggle-share-btn').html('<i class="fa fa-share"></i>');
  $('<hr>').insertAfter('#player-functions');
  $('#player-description').html(description);
  $('#player-episode-image').html('<img src="' + episodeImageURL + '" class="img-fluid">');

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
    if (autoplay === 'On' && autoplayOnceAtBeginning === false) {
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

function restartClip () {
  audio.pause();
  endTimeHasBeenReached = false;
  audio.currentTime = startTime;
  audio.play();
}

$('#player-stats-duration').on('click', function () {
  restartClip();
});

$('.playlist-item').on('click', function() {
  if (isPlayerPage) {
    var index = $(".playlist-item").index(this);
    loadMediaRef(index, true);
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
     $("#player-container").addClass('player-condensed');
     $('html').attr('style', 'padding-top: ' + bottomOfPlayerContainer + 'px;' );
    }
    else{
     $("#player-container").removeClass('player-condensed');
     $('html').attr('style', '');
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

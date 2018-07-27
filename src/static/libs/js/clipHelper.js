import { sendGoogleAnalyticsEvent } from './googleAnalytics.js';
import { previewEndTime, previewStartTime } from './mediaPlayer.js';
import { convertHHMMSSToSeconds, convertSecToHHMMSS, isHHMMSS,
         isInt, isUUID } from './utility.js';


export function initClipper () {

  $('#make-clip-start-time i, #make-clip-start-time div').on('click', function () {
    var startTime = $('#make-clip-start-time input').val() || "0";
    var endTime = $('#make-clip-end-time input').val();
    startTime = convertHHMMSSToSeconds(startTime);
    endTime = convertHHMMSSToSeconds(endTime);
    previewStartTime(startTime, endTime);
  });

  $('#make-clip-end-time i, #make-clip-end-time div').on('click', function () {
    var endTime = $('#make-clip-end-time input').val() || "3";
    endTime = convertHHMMSSToSeconds(endTime);
    previewEndTime(endTime);
  });

  $('#make-clip-time-set').on('click', function () {
    var currentTimeHHMMSS = convertSecToHHMMSS(Math.floor(audio.currentTime));
    var currentSetMode = $('#make-clip-time-set').html();
    if (currentSetMode === 'Set Start') {
      $('#make-clip-start-time input').val(currentTimeHHMMSS);
      $('#make-clip-end-time input').focus();
      $('#make-clip-time-set').html('Set End');
      sendGoogleAnalyticsEvent('Make Clip', 'Set End button clicked')
    } else if (currentSetMode === 'Set End') {
      $('#make-clip-end-time input').val(currentTimeHHMMSS);
      $('#make-clip-time-set').html('Set Start');
      $('#make-clip-title textarea').focus();
      sendGoogleAnalyticsEvent('Make Clip', 'Set Start button clicked')
    }
  });

  $('#player').on('mousedown', function (e) {
    e.preventDefault(e);
  });

  $('#make-clip-time-set').on('mousedown', function (e) {
    e.preventDefault(e);
  });

  $('#make-clip-time-back').on('mousedown', function (e) {
    e.preventDefault(e);
  });

  $('#make-clip-time-forwards').on('mousedown', function (e) {
    e.preventDefault(e);
  });

  $('#make-clip-time-back').on('click', function () {
    audio.currentTime = audio.currentTime - 15;
  });

  $('#make-clip-time-forwards').on('click', function () {
    audio.currentTime = audio.currentTime + 15;
  });

}

export function setStartTime () {
  $('#make-clip-start-time input').val(convertSecToHHMMSS(Math.floor(audio.currentTime)));
  $('#make-clip-end-time input').focus();
}

export function setEndTime () {
  $('#make-clip-end-time input').val(convertSecToHHMMSS(Math.floor(audio.currentTime)));
  $('#make-clip-title textarea').focus();
}

export function setClipPublic() {
  $('#makeClipPrivacyButton').html('<i class="fa fa-globe"></i> Public <i class="fa fa-angle-down"></i>');
  $('#make-clip-share-settings').html('<i class="fa fa-globe"></i> <span>Public:</span> <i>clip may appear anywhere on the site</i>')
}

export function setClipOnlyWithLink() {
  $('#makeClipPrivacyButton').html('<i class="fa fa-link"></i> Only with link <i class="fa fa-angle-down"></i>');
  $('#make-clip-share-settings').html('<i class="fa fa-link"></i> <span>Only with link:</span> <i>clip is visible to anyone with the link</i>')
}

export function setEditClipFields() {
  window.isEditingClip = true;
  $('#make-clip-header').html('Edit Clip');
  $('#make-clip-start-time input').val(convertSecToHHMMSS(window.startTime));
  $('#make-clip-end-time input').val(convertSecToHHMMSS(window.endTime));  
  $('#make-clip-title textarea').val(window.description);
  $('#make-clip-start-time input').focus();
  $('#make-clip-delete').show();

  if (window.isPublic === false) {
    setClipOnlyWithLink();
  } else {
    setClipPublic();
  }
}

export function toggleMakeClipWidget (_this) {
  $('#make-clip-header').html('Create a Clip');
  window.isEditingClip = false;
  setClipPublic();
  $('#make-clip-delete').hide();

  if ($('#add-to-playlist').css('display') !== 'block' && $('#recommend').css('display') !== 'block') {
    $('#player-description-truncated').hide();
    $('#player-description-full').hide();
    $('#player-description-show-more').hide();
    $('#player-clip-time').hide();
    $('.player-clip-edit').hide();
    $('#player-description-show-more').html(`<span class="text-primary">Show Notes</span>`);
    $('#playlist').hide();
  }

  if ($(_this).hasClass('active') || $(_this).is("#make-clip-cancel")) {
    $('#player-description-truncated').show();
    $('#player-description-show-more').show();
    $('#player-clip-time').show();
    $('.player-clip-edit').show();
    $('#playlist').show();
  }

  $('#add-to-playlist').hide();
  $('#toggle-playlist-btn').removeClass('active');

  $('#toggle-make-clip-btn').toggleClass('active');
  $('#make-clip').toggle();

  sendGoogleAnalyticsEvent('Make Clip', 'Toggle Make Clip Widget');
}

function validateClip() {

  // After the form is validated, display loading state and prevent resubmit
  if (window.preventResubmit) { return }
  window.preventResubmit = true;

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
    window.preventResubmit = false;
    return false;
  }

  if (!isHHMMSS(startTime) && startTime !== '') {
    $('#make-clip-start-time-error').html('Type time in hh:mm:ss format.');
    $('#make-clip-start-time').addClass('has-danger');
    $('#make-clip-start-time-error').show();
    window.preventResubmit = false;
    return false;
  }

  if (!isHHMMSS(endTime) && endTime !== '') {
    $('#make-clip-end-time-error').html('Type time in hh:mm:ss format.');
    $('#make-clip-end-time').addClass('has-danger');
    $('#make-clip-end-time-error').show();
    window.preventResubmit = false;
    return false;
  }

  startTime = convertHHMMSSToSeconds(startTime);
  endTime = convertHHMMSSToSeconds(endTime);

  if (startTime === 0 && (endTime === 0 || endTime === null)) {
    $('#make-clip-start-time-error').html('Type a start or end time.');
    $('#make-clip-start-time').addClass('has-danger');
    $('#make-clip-end-time').addClass('has-danger');
    $('#make-clip-start-time-error').show();
    window.preventResubmit = false;
    return false;
  }

  if (endTime === 0) {
    endTime = null;
  }

  if (startTime === endTime) {
    $('#make-clip-start-time-error').html('Start time and end time cannot be the same.');
    $('#make-clip-start-time').addClass('has-danger');
    $('#make-clip-end-time').addClass('has-danger');
    $('#make-clip-start-time-error').show();
    window.preventResubmit = false;
    return false;
  }

  if (endTime !== null && endTime <= startTime) {
    $('#make-clip-start-time-error').html('End time cannot be earlier than start time.');
    $('#make-clip-start-time').addClass('has-danger');
    $('#make-clip-end-time').addClass('has-danger');
    $('#make-clip-start-time-error').show();
    window.preventResubmit = false;
    return false;
  }

  var clipTitle = $('#make-clip-title textarea').val();

  let isPublic = document.getElementById('makeClipPrivacyButton').innerHTML;
  isPublic = isPublic.indexOf('Public') > -1;

  return {
    startTime,
    endTime,
    clipTitle,
    isPublic
  };
}

export function makeClip (event) {
  event.preventDefault();

  sendGoogleAnalyticsEvent('Make Clip', 'Make Clip');

  let validatedClip = validateClip();

  if (!validatedClip) { return };

  $('#make-clip-btn').attr('disabled', true);
  $('#make-clip-cancel').attr('disabled', true);
  $('#make-clip-delete').attr('disabled', true);
  $('#make-clip-btn').html('<i class="fa fa-spinner fa-spin"></i>');

  let dataObj = {
    startTime: validatedClip.startTime,
    endTime: validatedClip.endTime,
    title: validatedClip.clipTitle,
    isPublic: validatedClip.isPublic,
    podcastFeedUrl: window.podcastFeedUrl,
    podcastTitle: window.podcastTitle,
    episodeMediaUrl: window.episodeMediaUrl,
    episodeTitle: window.episodeTitle,
    episodePubDate: window.episodePubDate,
    episodeSummary: window.episodeSummary,
    episodeDuration: window.episodeDuration
  }

  if (window.podcastImageUrl && window.podcastImageUrl.indexOf('http') === 0) {
    dataObj.podcastImageUrl = window.podcastImageUrl;
  }

  if (window.episodeImageUrl && window.episodeImageUrl.indexOf('http') === 0) {
    dataObj.episodeImageUrl = window.episodeImageUrl;
  }

  $.ajax({
    type: 'POST',
    url: '/clips',
    headers: {
      Authorization: $.cookie('idToken')
    },
    data: dataObj,
    success: function (response) {
      if (window.isPlayerPage) {
        toggleMakeClipWidget();
        $('#playlist').show();
        $('#make-clip-start-time input').val('');
        $('#make-clip-end-time input').val('');
        $('#make-clip-title textarea').val('');
        $('#player-description-truncated').show();
        $('#clip-created-modal-link').val(location.protocol + '\/\/' + location.hostname + (location.port ? ':' + location.port : '') + '\/clips\/' + response.id);
        $('#clip-created-modal').attr('data-id', response.id);
        $('#clip-created-modal').modal('show');
      } else {
        location.href = '\/clips\/' + response.id;
      }
    },
    error: function (xhr, status, error) {
      console.log(error);
      alert('Failed to create clip. Please check your internet connection and try again.');
    },
    complete: function () {
      window.preventResubmit = false;
      $('#make-clip-btn').removeAttr('disabled');
      $('#make-clip-cancel').removeAttr('disabled');
      $('#make-clip-delete').removeAttr('disabled');
      $('#make-clip-btn').html('Save');
    }
  });

}

export function updateClip(event) {
  event.preventDefault();

  sendGoogleAnalyticsEvent('Update Clip', 'Update Clip');

  let validatedClip = validateClip()

  if (!validatedClip) { return };

  $('#make-clip-btn').attr('disabled', true);
  $('#make-clip-cancel').attr('disabled', true);
  $('#make-clip-delete').attr('disabled', true);
  $('#make-clip-btn').html('<i class="fa fa-spinner fa-spin"></i>');

  let dataObj = {
    id: window.mediaRefId,
    startTime: validatedClip.startTime,
    endTime: validatedClip.endTime,
    title: validatedClip.clipTitle,
    isPublic: validatedClip.isPublic
  }

  $.ajax({
    type: 'PUT',
    url: '/clips',
    headers: {
      Authorization: $.cookie('idToken')
    },
    data: dataObj,
    success: function (response) {
      location.href = '\/clips\/' + response.id;
    },
    error: function (xhr, status, error) {
      console.log(error);
      $('#make-clip-btn').removeAttr('disabled');
      $('#make-clip-cancel').removeAttr('disabled');
      $('#make-clip-delete').removeAttr('disabled');
      $('#make-clip-btn').html('Save');
      alert('Failed to update clip. Please check your internet connection and try again.');
    }
  });

}

export function deleteClip(event) {
  event.preventDefault();

  sendGoogleAnalyticsEvent('Delete Clip', 'Delete Clip');

  let shouldDelete = confirm('Are you sure you want to delete this clip?');

  if (!shouldDelete) { return }

  $('#make-clip-btn').attr('disabled', true);
  $('#make-clip-cancel').attr('disabled', true);
  $('#make-clip-delete').attr('disabled', true);
  $('#make-clip-delete').html('<i class="fa fa-spinner fa-spin"></i>');

  $.ajax({
    type: 'DELETE',
    url: '/clips/' + window.mediaRefId,
    headers: {
      Authorization: $.cookie('idToken')
    },
    success: function (response) {
      alert('Clip deleted successfully.')
      location.href = '/'
    },
    error: function (xhr, status, error) {
      console.log(error);
      $('#make-clip-delete').removeAttr('disabled');
      $('#make-clip-cancel').removeAttr('disabled');
      $('#make-clip-btn').removeAttr('disabled');
      $('#make-clip-delete').html('Save');
      alert('Could not delete clip. Please check your internet connection and try again.');
    }
  });

}

export function requestPaginatedClipsFromAPI(params) {
  return new Promise ((resolve, reject) => {

    let data = {
      podcastFeedUrls: params.podcastFeedUrls
    };

    if (params.episodeMediaUrl) {
      data.episodeMediaUrl = params.episodeMediaUrl;
    }

    if (params.sortType) {
      data.sortType = params.sortType;
    }

    $.ajax({
      type: 'POST',
      url: '/api/clips',
      data: data,
      success: function (result) {
        resolve(result);
      },
      error: function (xhr, status, error) {
        reject(error);
      }
    });
  });
}

import { copyToClipboard } from './copyToClipboard.js';

$('#clip-created-modal-nav-btn').on('click', function () {
  clipCreatedNavToClip();
});

$('#clip-created-modal-copy-btn').on('click', function () {
  clipCreatedCopyURL();
});

function clipCreatedCopyURL () {
  copyToClipboard(document.getElementById('clip-created-modal-link'));
  $('#clip-created-modal-copy-btn').html('Copied Link!');
  setTimeout(function () {
    $('#clip-created-modal').modal('hide');
    setTimeout(function () {
      $('#clip-created-modal-copy-btn').html('Copy Clip Link');
    }, 500);
  }, 800);
}

function clipCreatedNavToClip () {
  location.href = $('#clip-created-modal-link').val();
}

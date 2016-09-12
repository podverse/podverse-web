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
  location.href = $('#clip-created-modal-link').html();
}

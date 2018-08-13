import Clipboard from 'clipboard';
const shareModal = $('#shareModal');
const shareModalBody = $('#shareModal .modal-buttons');

export function toggleShareModal () {
  updateShareModal();
  shareModal.modal('show');
}

function updateShareModal() {

  shareModalBody.html('');

  let episodeLink = '';
  if (window.episodeId) {
    episodeLink = `${[location.protocol, '//', location.host, '/episodes/', window.episodeId].join('')}`;
  } else {
    episodeLink = `${[location.protocol, '//', location.host, '/episodes/alias?mediaUrl=', window.episodeMediaUrl].join('')}`;
  }
  
  shareModalBody.append(`<button class="btn btn-secondary btn-block share-modal-btn" data-clipboard-text="${episodeLink}">Episode</button>`);

  if (mediaRefId && (mediaRefId.indexOf('episode_') === -1 || mediaRefId.indexOf('episode_') > 0)) {
    const clipLink = `${[location.protocol, '//', location.host, '/clips/', window.mediaRefId].join('')}`;
    shareModalBody.append(`<button class="btn btn-secondary btn-block share-modal-btn" data-clipboard-text="${clipLink}">Clip</button>`);
  }

  const officialLink = window.episodeLinkUrl;
  if (officialLink) {
    shareModalBody.append(`<button class="btn btn-secondary btn-block share-modal-btn" data-clipboard-text="${officialLink}">Official Link</button>`);
  }

  setTimeout(function () {
    let clipboard = new Clipboard('.share-modal-btn', {
      container: document.getElementById('shareModal')
    });

    $('.share-modal-btn').on('click', function () {
      $(this).html('Copied Link!');

      setTimeout(function () {
        shareModal.modal('hide');
      }, 800);
    });
  }, 100);

}

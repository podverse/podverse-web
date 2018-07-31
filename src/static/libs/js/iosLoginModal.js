$('#iosLoginModal').on('shown.bs.modal', function () {
  $('#iosLoginModalGoToAppStoreButton').focus();
});

$('#iosLoginModalGoToAppStoreButton').on('click', function () {
  window.location.href = 'https://itunes.apple.com/us/app/podverse/id1390888454?mt=8&ign-mpt=uo%3D4';
});

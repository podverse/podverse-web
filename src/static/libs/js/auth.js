if (!$.cookie('idToken')) {
  createAuthCookie();
}

function createAuthCookie() {

  // If the browser does not have a valid idToken, then provide one.
  $.post('auth/anonLogin')
    .done(function (data) {

      // TODO: must make this a secure cookie...don't we need to run the app
      // on https://localhost to do that?
      // $.cookie('idToken', data.idToken, { secure:true });

      $.cookie('idToken', data.idToken, { secure:false });
    })
    .fail(function (error) {
      // TODO: add more helpful error messaging
      alert('errrror');
    });

}

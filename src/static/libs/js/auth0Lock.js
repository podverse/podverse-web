
function showLoginWidget () {
  // TODO: setup environment variables...
  var clientId = '',
      domain = '';

  var options = {
    auth: {
      redirectUrl: 'http://localhost:8080/',
      responseType: 'token',
      params: {
        scope: 'openid'
      }
    }
  };

  lock = new Auth0Lock(clientId, domain, options);

  lock.on('authenticated', function (authResult) {
    console.log(authResult);
    lock.getProfile(authResult.idToken, function (error, profile) {
      if (error) {
        // TODO: handle error
        return;
      }
    })
  });

  lock.show();
}

// Default Anon Authenticated user stuff
if (!$.cookie('idToken')) {
  createAnonAuthCookie();
}

function createAnonAuthCookie() {

  // If the browser does not have a valid idToken, then provide one.
  $.post('/auth/anonLogin')
    .done(function (data) {

      // TODO: must make this a secure cookie...don't we need to run the app
      // on https://localhost to do that?
      // $.cookie('idToken', data.idToken, { secure:true });

      $.cookie('idToken', data.idToken, { secure:false });

      removeUserProfileFromLocalStorage();
    })
    .fail(function (error) {
      // TODO: add more helpful error messaging
      console.log(error);
      alert('errrror');
    });

}



// Auth0Lock stuff
var options = {
  auth: {
    redirectUrl: 'http://localhost:8080/login-redirect?redirectTo=' + location.href,
    responseType: 'token',
    params: {
      scope: 'openid name email'
    }
  }
};

// TODO: setup environment variables...
var clientId = '',
    domain = '';

var lock = new Auth0Lock(clientId, domain, options);

lock.on('authenticated', function (authResult) {
  // Remove # from end of url
  window.location.replace("#");
  if (typeof window.history.replaceState == 'function') {
    history.replaceState({}, '', window.location.href.slice(0, -1));
  }

  lock.getProfile(authResult.idToken, function (error, profile) {

    if (error) {
      // TODO: handle error
      alert('errrror');
      return;
    }

    // Remove the anonymous user idToken first
    $.removeCookie('idToken');

    // TODO: must make this a secure cookie...would we need to run the app
    // on https://localhost to develop?
    // $.cookie('idToken', data.idToken, { secure:true });
    $.cookie('idToken', authResult.idToken, { secure:false });

    saveUserProfileToLocalStorage(profile);

    appendLoggedInUserNavButtons();

    findOrCreateUserOnServer();
  })
});

function findOrCreateUserOnServer () {
  $.ajax({
    beforeSend: function (request) {
      request.setRequestHeader('Authorization', $.cookie('idToken'));
    },
    type: 'POST',
    url: '/users'
  });
}

function saveUserProfileToLocalStorage (profile) {
  localStorage.setItem('email', profile.email);
  localStorage.setItem('nickname', profile.nickname);
  localStorage.setItem('picture', profile.picture);
}

function removeUserProfileFromLocalStorage () {
  localStorage.removeItem('email');
  localStorage.removeItem('nickname');
  localStorage.removeItem('picture');
}

function logoutUser () {
  $.removeCookie('idToken');
  removeUserProfileFromLocalStorage();
  location.reload();
}

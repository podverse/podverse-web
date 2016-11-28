import { sendGoogleAnalyticsEvent } from './googleAnalytics.js';

// Default Anon Authenticated user stuff
if (!$.cookie('idToken')) {
  createAnonAuthCookie();
}

var clientId = __AUTH0_CLIENTID__,
    domain = __AUTH0_DOMAIN__;

// Auth0Lock stuff
var options = {
  auth: {
    redirectUrl: __BASE_URL__ + '/login-redirect?redirectTo=' + location.href,
    responseType: 'token',
    params: {
      scope: 'openid name email'
    }
  },
  additionalSignUpFields: [{
    name: 'name',
    placeholder: 'type your name (for sharing playlists)'
  }]
};

let lock = new Auth0Lock(clientId, domain, options);

$(window).ready(() => {
  $('#login-btn').on('click', () => {
    lock.show();
    sendGoogleAnalyticsEvent('Auth', 'Show Lock Modal');
  });
});

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

    $.cookie('idToken', authResult.idToken, { secure: __IS_PROD__, path: '/' });

    saveUserProfileToLocalStorage(profile);

    findOrCreateUserOnServer(profile);
  })
});

function createAnonAuthCookie() {

  // If the browser does not have a valid idToken, then provide one.
  $.post('/auth/anonLogin')
    .done(function (data) {

      $.cookie('idToken', data.idToken, { secure: __IS_PROD__, path: '/' });

      removeUserProfileFromLocalStorage();
    })
    .fail(function (error) {
      // TODO: add more helpful error messaging
      console.log(error);
      alert('errrror');
    });

}

function findOrCreateUserOnServer (profile) {
  var name = profile.user_metadata && profile.user_metadata.name;

  $.ajax({
    beforeSend: function (request) {
      request.setRequestHeader('Authorization', $.cookie('idToken'));
    },
    type: 'POST',
    url: '/users',
    data: {
      name: name
    },
    dataType: 'json',
    success: function () {
      location.href = loginRedirectURL;
    }
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

export function logoutUser () {
  $.removeCookie('idToken', { path: '/' });
  removeUserProfileFromLocalStorage();
  sendGoogleAnalyticsEvent('Auth', 'Logout User');
  location.reload();
}

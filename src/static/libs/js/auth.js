import { sendGoogleAnalyticsEvent } from './googleAnalytics.js';

var clientId = __AUTH0_CLIENTID__,
    domain = __AUTH0_DOMAIN__;

// Auth0Lock stuff
var options = {
  auth: {
    redirectUrl: __BASE_URL__ + '/login-redirect?redirectTo=' + location.href,
    responseType: 'token',
    params: {
      scope: 'openid name email user_metadata'
    }
  },
  additionalSignUpFields: [{
    name: 'name',
    placeholder: 'your name (public)'
  }],
  theme: {
    primaryColor: '#2968B1'
  },
  languageDictionary: {
    emailInputPlaceholder: "email address",
    passwordInputPlaceholder: "password"
  },
};

let lock = new Auth0Lock.default(clientId, domain, options);

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
      alert('Authentication error. Please check your internet connection and try again.');
      return;
    }

    $.cookie('idToken', authResult.idToken, {
      secure: __IS_PROD__,
      path: '/',
      expires: 365
    });

    findOrCreateUserOnServer(profile);
  })
});

function findOrCreateUserOnServer (profile) {
  var name = profile.user_metadata && profile.user_metadata.name;

  $.ajax({
    beforeSend: function (request) {
      request.setRequestHeader('Authorization', $.cookie('idToken'));
    },
    type: 'POST',
    url: '/users',
    data: {
      name: name,
      nickname: profile.nickname
    },
    dataType: 'json',
    success: function () {
      location.href = loginRedirectUrl;
    }
  });

}

export function logoutUser () {
  $.removeCookie('idToken', { path: '/' });
  sendGoogleAnalyticsEvent('Auth', 'Logout User');
  location.reload();
}

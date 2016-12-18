import { sendGoogleAnalyticsEvent } from './googleAnalytics.js';
import { isLocalStorageSupported } from './browserSupportDetection.js';

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
    placeholder: 'your name (for sharing playlists)'
  }],
  theme: {
    primaryColor: '#2968B1'
  },
  languageDictionary: {
    emailInputPlaceholder: "email address",
    passwordInputPlaceholder: "password"
  },
};

let lock = new Auth0Lock(clientId, domain, options);

$(window).ready(() => {
  $('#login-btn').on('click', () => {
    if (isLocalStorageSupported()) {
      lock.show();
      sendGoogleAnalyticsEvent('Auth', 'Show Lock Modal');
    } else {
      alert('If you are using iOS Safari in Private Browsing mode, please switch to Regular Browsing mode to log into Podverse.')
    }
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

    $.cookie('idToken', authResult.idToken, { secure: __IS_PROD__, path: '/' });

    saveUserProfileToLocalStorage(profile);

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

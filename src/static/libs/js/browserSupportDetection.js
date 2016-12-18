// Thanks :) philfreo
// http://stackoverflow.com/questions/14555347/html5-localstorage-error-with-safari-quota-exceeded-err-dom-exception-22-an

export function isLocalStorageSupported() {
  // Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem
  // throw QuotaExceededError. We're going to detect this and just silently drop any calls to setItem
  // to avoid the entire page breaking, without having to do a check at each usage of Storage.
  if (typeof localStorage === 'object') {
      try {
          localStorage.setItem('localStorage', 1);
          localStorage.removeItem('localStorage');
          return true;
      } catch (e) {
          Storage.prototype._setItem = Storage.prototype.setItem;
          Storage.prototype.setItem = function() {};
          return false;
      }
  }
}

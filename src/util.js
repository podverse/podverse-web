'use strict';

// Used by the backend in middleware in routes.js
function isNonAnonUser (userId='') {
  return (userId.indexOf('auth0') === 0);
}

// Thanks Fernando Aguilar http://stackoverflow.com/questions/23593052/format-javascript-date-to-yyyy-mm-dd#comment66229498_38148759
function dateInServersTimezone (minutesOffset=0) {
  let todayDate = new Date();
  todayDate.setMinutes((todayDate.getMinutes() - todayDate.getTimezoneOffset()) + minutesOffset);
  todayDate = todayDate.toISOString().slice(0,10);
  return todayDate;
}

function lastHourInServersTimezone () {
  let todayDate = new Date();
  todayDate.setMinutes((todayDate.getMinutes() - todayDate.getTimezoneOffset()) - 60);
  let lastHour = todayDate.toISOString().slice(11,13);
  return lastHour;
}


module.exports = {
  isNonAnonUser,
  dateInServersTimezone,
  lastHourInServersTimezone
}

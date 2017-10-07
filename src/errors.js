
function filtertypeNotAllowedMessage (filtertype) {
  return `Unrecognized filter "${filtertype}" provided. Allowed filter types are: pastHour, pastDay, pastMonth, pastYear, allTime, or recent.`;
}

module.exports = {
  filtertypeNotAllowedMessage
}

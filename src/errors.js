
function filterTypeNotAllowedMessage (filterType) {
  return `Unrecognized filter "${filterType}" provided. Allowed filter types are: pastHour, pastDay, pastMonth, pastYear, allTime, or recent.`;
}

module.exports = {
  filterTypeNotAllowedMessage
}


function sortTypeNotAllowedMessage (sortType) {
  return `Unrecognized filter "${sortType}" provided. Allowed filter types are: pastHour, pastDay, pastMonth, pastYear, allTime, or recent.`;
}

module.exports = {
  sortTypeNotAllowedMessage
}

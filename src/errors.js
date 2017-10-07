
function sortingTypeNotAllowedMessage (sortingType) {
  return `Unrecognized filter "${sortingType}" provided. Allowed filter types are: pastHour, pastDay, pastMonth, pastYear, allTime, or recent.`;
}

module.exports = {
  sortingTypeNotAllowedMessage
}

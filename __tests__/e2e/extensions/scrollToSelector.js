module.exports.command = function (selector, extraScrollDirection = 'up') {
  this.execute(`document.querySelector('${selector}').scrollIntoView()`)

  if (extraScrollDirection === 'up') {
    // Offset the scroll by y: -150 so the navbar is not in the way of clicking the element.
    this.scrollByPixels(0, -150)
  } else if (extraScrollDirection === 'down') {
    // Offset the scroll by y: 150 so the mini player is not in the way of clicking the element.
    this.scrollByPixels(0, 150)
  }

  return this
}

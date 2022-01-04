module.exports.command = function (dropdownToggle, dropdownItem) {
  const dropdownToggleXpath = `//button[@class="transparent dropdown-toggle btn btn-secondary"][contains (text(), "${dropdownToggle}")]`
  const dropdownItemXpath = `//button[@class="dropdown-item"][contains (text(), "${dropdownItem}")]`

  this.click('xpath', dropdownToggleXpath)
  this.click('xpath', dropdownItemXpath)

  return this
}

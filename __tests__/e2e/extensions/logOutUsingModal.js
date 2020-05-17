module.exports.command = function () {
  this.click({
    locateStrategy: 'xpath',
    selector: '//ul[@class="ml-auto navbar-nav"]//li[@class="dropdown nav-item"]//button[@class="dropdown-toggle btn btn-secondary"]'
  })
  this.pause(500)

  this.click({
    locateStrategy: 'xpath',
    selector: '//div[@class="dropdown-menu dropdown-menu-right show"]//button[@class="dropdown-item"][contains (text(), "Log out")]'
  })
  this.pause(500)

  this.url('https://stage.podverse.fm')
  this.waitForElementPresent({
    locateStrategy: 'xpath',
    selector: '//li[@class="hide-mobile nav-item"]//a[@class="nav-link"][contains(text(), "Login")]'
  })

  return this
}


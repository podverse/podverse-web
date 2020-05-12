module.exports.command = function (title, description) {
  this.expect.element(`meta[name="title"][content="${title}"]`).to.be.present
  this.expect.element(`meta[property="og:title"][content="${title}"]`).to.be.present
  this.expect.element(`meta[name="twitter:title"][content="${title}"]`).to.be.present
  this.expect.element(`meta[name="description"][content="${description}"]`).to.be.present
  this.expect.element(`meta[property="og:description"][content="${description}"]`).to.be.present
  this.expect.element(`meta[name="twitter:description"][content="${description}"]`).to.be.present

  return this
}

const {configureDatabaseModels, createTestApp} = require('test/helpers.js');


// describe('API Test: Playlists', function () {
//
//   configureDatabaseModels(function (Models) {
//     this.Models = Models;
//   });
//
//   beforeEach(function () {
//     this.app = createTestApp(this.Models);
//
//     this.playlist = {
//       title: 'My Favorite Episodes and Clips about Penguins'
//     };
//   });
//
//   describe('make a POST request', function () {
//
//     describe('without the secret API key', function () {
//       it('should reject the request', function (done) {
//         chai.request(this.app)
//           .post(`/playlists`)
//           .send(this.playlist)
//           .end(function (err, res) {
//             expect(res)
//               .to.have.status(401);
//             done();
//           });
//       });
//     });
//
//     describe('with the secret API key', function () {
//       it('should create a playlist', function (done) {
//
//         chai.request(this.app)
//           .post(`/playlists`)
//           .send(this.playlist)
//           .end(function (err, res) {
//             const response = res.body;
//             expect(response.title)
//               .to.equal('My Favorite Episodes and Clips about Penguins');
//             done();
//           });
//       });
//     })
//
//   });
//
//   xit('should be able to retrieve the playlist in the database', function (done) {
//     let id = this.testPodcast.id;
//
//     chai.request(this.app)
//       .get(`/podcasts/${id}`)
//       .end(function (err, res) {
//         const response = res.body;
//
//         expect(response.title)
//           .to.equal('foobar');
//         expect(response.feedURL)
//           .to.equal('http://example.com/rss');
//
//         done();
//       });
//
//
//   });
// });

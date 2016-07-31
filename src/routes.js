const {locator} = require('locator.js');
const errors = require('feathers-errors');

function routes () {
  const app = this;

  app.get('/', function (req, res) {
    res.render('home.html')
  });

  app.post('/playlists/addItem', (req, res) => {
    const {Playlist, MediaRef} = locator.get('Models');

    return Promise.all([
      Playlist.findById(req.body.playlistId),
      MediaRef.findById(req.body.mediaRefId)
    ])
    .then(([playlist, mediaRef]) => {
      playlist.setMediaRefs(mediaRef).then(() => {
        res.status(200).send('playlist item has been added to playlist');
      });
    })
    .catch(e => {
      throw new errors.GeneralError(e);
    });
  });

  app.post('/playlists/removeItem', (req, res) => {
    const {Playlist, MediaRef} = locator.get('Models');

    return Promise.all([
      Playlist.findById(req.body.playlistId),
      MediaRef.findById(req.body.mediaRefId)
    ])
    .then(([playlist, mediaRef]) => {
      playlist.removeMediaRefs(mediaRef).then(() => {
        res.status(200).send('playlist item has been removed from playlist');
      });
    })
    .catch(e => {
      throw new errors.GeneralError(e);
    })
  });

}

module.exports = {routes};

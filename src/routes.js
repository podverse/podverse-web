const {locator} = require('locator.js');

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
      // TODO: handle errors properly...
      console.log(e);
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
      // TODO: handle errors properly...
      console.log(e);
    })
  });

}

module.exports = {routes};

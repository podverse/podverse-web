"use strict";

let
  clipRepository = new (require('./ClipRepository.js'))(),
  playlistServiceFactory = require('./playlistServiceFactory.js'),
  config = require('./config.js');



module.exports = app => {

  app.get('/', function(req, res) {
    res.render('player.html');
  });

  // View a clip
  app.get('/c/:id', (req, res) => {

    clipRepository.getClip(req.params.id)
      .then(clip => {
        res.render('player.html', clip);
      })
      .catch(e => {
        console.error(e);
        res.sendStatus(404);
      });
  });

  // Create a clip
  app.post('/c', (req, res) => {

    let clip = req.body;

    clipRepository.createClip(clip)
      .then(clipId => {

        // Send the URI of the clip back somehow
        let result = {
          clipUri: `${config.baseURL}/c/${clipId}`
        };

        res.status(201).send(result);
      })
      .catch(e => {
        res.status(500).send(e);
      });
  });


  app.get('/playlist/:id', (req, res) => {
    let svc = playlistServiceFactory();
    svc.get(req.params.id)
      .then(playlist => res.render('player.html', playlist))
      .catch(e=> {
        res.sendStatus(404);
      });
  });

}

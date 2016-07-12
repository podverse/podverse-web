"use strict";

let
  config = require('./config.js'),
  // clipRepository = new (require('./ClipRepository.js'))(),
  playlistServiceFactory = require('./playlistServiceFactory.js'),
  JWTAuthHelper = new (require('./JWTAuthHelper.js'))(),
  pvFeedParser = new (require('./PVFeedParser.js'))(),
  requireAPISecret = require('./requireAPISecretMiddleware.js'),
  checkJWTAuth = require('./checkJWTAuthMiddleware.js'),
  fs = require('fs');
  // TODO: enable csrf protection for web app, see bottom of file
  // csrf = require('csurf'),
  // session = require('express-session'), // required for csurf
  // bodyParser = require('body-parser'), // required for csurf
  // cookieParser = require('cookie-parser'); // required for csurf

module.exports = app => {

  //
  //// Web Pages
  ///

  // app.get('/', function(req, res) {
  //   clipRepository.getHomeScreenClips()
  //     .then(clips => {
  //       res.locals.currentPage = 'Home';
  //       res.render('home.html', {clips});
  //     })
  //     .catch(e => {
  //       console.error(e);
  //       res.sendStatus(500);
  //     });
  // });

  app.get('/mobile-app', function(req, res) {
    res.locals.currentPage = 'Mobile App';
    res.render('mobile-app.html');
  });

  app.get('/about', function(req, res) {
    res.locals.currentPage = 'About';
    res.render('about.html');
  });



  //
  //// Clips
  ///

  // View a clip
  // app.get('/c/:id', (req, res) => {
  //   clipRepository.getClip(req.params.id)
  //     .then(clip => {
  //       res.locals.currentPage = 'Clip';
  //       res.render('player.html', clip);
  //     })
  //     .catch(e => {
  //       console.error(e);
  //       res.sendStatus(404);
  //     });
  // });
  //
  // app.get('/c', (req, res) => {
  //   let userId = req.query.userId;
  //
  //   if(!userId) {
  //     res.sendStatus(400);
  //     return;
  //   }
  //
  //   clipRepository.getClipsByUserId(userId)
  //     .then(clips => {
  //       res.send(clips);
  //     });
  //
  // });
  //
  // // Create a clip
  // app.post('/c', requireAPISecret, (req, res) => {
  //
  //   let clip = req.body;
  //
  //   clipRepository.createClip(clip)
  //     .then(clipId => {
  //       // Send the URI of the clip back somehow
  //       let result = {
  //         clipUri: `${config.baseURL}/c/${clipId}`
  //       };
  //
  //       res.status(201).send(result);
  //     })
  //     .catch(e => {
  //       res.status(500).send(e);
  //     });
  // });



  //
  //// Playlists
  ///
  app.get('/playlist/:id', (req, res) => {
    let svc = playlistServiceFactory();
    res.locals.currentPage = 'Playlist';
    svc.get(req.params.id)
      .then(playlist => res.render('player.html', playlist))
      .catch(()=> {
        res.sendStatus(404);
      });
  });

  app.use('/pl', requireAPISecret);
  app.use('/pl', checkJWTAuth);
  app.use('/pl', playlistServiceFactory());



  //
  //// Auth / Login
  ///

  app.get('/login', function(req, res) {
    res.locals.currentPage = 'Login';
    // res.locals.csrf = req.csrfToken();
    res.render('login.html');
  });

  app.post('/auth', function(req, res) {
    JWTAuthHelper.createMobileOrWebJWT(req, res);
  });



  //
  //// Podcast Feed Parser
  ///

  // Parse an RSS Feed
  app.get('/parse', (req, res) => {
    pvFeedParser.parseFeed('http://joeroganexp.joerogan.libsynpro.com/rss')
    .then(parsedFeedObj => {
      res.send(401, parsedFeedObj.podcast.title);
      // res.send(401, parsedFeedObj.episodes[0].title);
    });
  });

  app.get('/localFeed', (req, res) => {
    fs.readFile(__dirname + '/assets/joe_rogan_rss.xml', 'utf8', function(err, data) {
      if (err) {
        return console.log(err);
      }
      res.send(200, data);
    });
  });

};

// let sess = {
//   secret: config.apiSecret,
//   resave: false,
//   saveUninitialized: true,
//   cookie: {}
// }
// if (app.get('env') === 'production') { // TODO: setup production value in NODE_ENV
//   app.set('trust proxy', 1);
//   sess.cookie.secure = true;
// }
// app.use(session(sess));

// app.use(bodyParser());
// let parseForm = bodyParser.urlencoded({ extended: true });
// app.use(cookieParser());
// app.use(csrf());
// let csrfProtection = csrf({ cookie: false });


// Test pages for JWT auth website stuff
// app.get('/secretAboutPage', checkAuthToken, function (req, res) {
//   res.locals.currentPage = 'Secret About Page';
//   res.render('about.html');
// });
//
// app.get('/mySecretUserPage', checkAuthToken, function (req, res) {
//   let userId = req.token.body.sub;
//   if (userId !== 'meech123') {
//     res.send(401, "Error: Not authorized. You're not meech@podverse.fm!");
//   } else {
//     res.locals.currentPage = 'Secret About Page';
//     res.render('about.html');
//   }
// });

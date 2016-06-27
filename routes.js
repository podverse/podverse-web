"use strict";

let
  clipRepository = new (require('./ClipRepository.js'))(),
  playlistServiceFactory = require('./playlistServiceFactory.js'),
  config = require('./config.js'),
  requireAPISecret = require('./requireAPISecretMiddleware.js'),
  nJwt = require('njwt'),
  bodyParser = require('body-parser'),
  Cookies = require('Cookies'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  csrf = require('csurf'),
  pvFeedParser = new (require('./PVFeedParser.js'))(),
  fs = require('fs');

let secretKey = 'wiiide-open';

function checkAuthToken(req, res, next) {

  // Auth tokens only need to be checked when we're updating an existing item
  if (req.method !== 'PUT') {
    next();
    return
  }

  let token;

  if (req.headers['user-agent'] == 'Mobile App') {
    token = req.headers['x-auth-token'];
  } else {
    token = new Cookies(req, res).get('access_token');
  }

  if (typeof token !== 'undefined') {
    let verifiedJwt = nJwt.verify(token, secretKey);
    if (verifiedJwt === 'error: not authorized') {
      res.send(401, "Error: Not authorized");
    } else {
      req.feathers.token = token;
      // req.token = verifiedJwt;
      next();
    }
  } else {
    res.send(401, "Error: Not authorized");
  }
}

function verifyCredentials (username, password) {
  let combos = {
     "vince@example.com": 'free access',
     "creon@example.com": 'free access',
     "mitch@example.com": 'free access'
  }
  return (combos[username] === password);
}

module.exports = app => {

  app.use(bodyParser());
  var parseForm = bodyParser.urlencoded({ extended: true });

  var sess = {
    secret: 'wide-open', // TODO: make super secret
    resave: false,
    saveUninitialized: true,
    cookie: {}
  }
  if (app.get('env') === 'production') { // TODO: setup production value in NODE_ENV
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
  }
  app.use(session(sess));

  app.use(cookieParser());

  // app.use(csrf());
  // var csrfProtection = csrf({ cookie: false });

  app.get('/', function(req, res) {
    clipRepository.getHomeScreenClips()
      .then(clips => {
        res.locals.currentPage = 'Home';
        res.render('home.html', {clips});
      })
      .catch(e => {
        console.error(e);
        res.sendStatus(500);
      });
  });

  app.get('/mobile-app', function(req, res) {
    res.locals.currentPage = 'Mobile App';
    res.render('mobile-app.html');
  });

  app.get('/about', function(req, res) {
    res.locals.currentPage = 'About';
    res.render('about.html');
  });

  // View a clip
  app.get('/c/:id', (req, res) => {
    clipRepository.getClip(req.params.id)
      .then(clip => {
        res.locals.currentPage = 'Clip';
        res.render('player.html', clip);
      })
      .catch(e => {
        console.error(e);
        res.sendStatus(404);
      });
  });

  app.get('/c', (req, res) => {
    let userId = req.query.userId;

    if(!userId) {
      res.sendStatus(400);
      return;
    }

    clipRepository.getClipsByUserId(userId)
      .then(clips => {
        res.send(clips);
      });

  });

  // Create a clip
  app.post('/c', requireAPISecret, (req, res) => {

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
    res.locals.currentPage = 'Playlist';
    svc.get(req.params.id)
      .then(playlist => res.render('player.html', playlist))
      .catch(()=> {
        res.sendStatus(404);
      });
  });

  //
  //// Playlists
  ///
  app.use('/pl', require('./requireAPISecretMiddleware.js'));
  app.use('/pl', checkAuthToken);
  app.use('/pl', playlistServiceFactory());

  app.get('/login', function(req, res) {
    res.locals.currentPage = 'Login';
    // res.locals.csrf = req.csrfToken();
    res.render('login.html');
  });

  // TODO: add CSRF protection?
  app.post('/auth', function(req, res) {
    if (!verifyCredentials(req.body.username, req.body.password)) {
      res.send(401, "Wrong user or password");
      return
    }

    let claims = {
      iss: 'http://localhost:9000', // for development
      // iss: 'https://podverse.fm', // for production
      sub: req.body.username, // unique user ID, do NOT use personally identifiable info like email
      scope: 'self, admins'
    }

    let jwt = nJwt.create(claims, secretKey);
    jwt.setExpiration(new Date().getTime() + (60*60*1000)); // One hour from now
    let token = jwt.compact();

    if (req.headers['user-agent'] == 'Mobile App') {
      res.json({ token: token });
    } else {
      let cookieSettings = { httpOnly: true };
      if (app.get('env') === 'production') { // TODO: setup production value in NODE_ENV
        cookieSettings.secure = true;
      }
      new Cookies(req, res).set('access_token', token, cookieSettings);

      res.redirect('secretAboutPage');
    }
  });

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
    })
  })
};

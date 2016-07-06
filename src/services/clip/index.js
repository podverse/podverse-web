'use strict';

const hooks = require('./hooks');

const ClipService = require('./ClipService');

module.exports = function(){
  const app = this;

  const {MediaRef} = app.get('sequelizeModels');

  const options = {
    Model: MediaRef,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/clips', new ClipService(options));

  // Get our initialize service to that we can bind hooks
  const clipService = app.service('/clips');

  // Set up our before hooks
  clipService.before(hooks.before);

  // Set up our after hooks
  clipService.after(hooks.after);
};

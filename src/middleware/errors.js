// copied from feathers-generator long ago

const errors = require('feathers-errors');

function errorHandler () {
  const app = this;

  app.use(function(error, req, res, next) {

    if (typeof error === 'string') {
      error = new errors.GeneralError(error);
    } else if ( !(error instanceof errors.FeathersError) ) {
      let oldError = error;
      error = new errors.GeneralError(oldError.message, {errors: oldError.errors});
      if (oldError.stack) {
        error.stack = oldError.stack;
      }
    }

    const code = !isNaN( parseInt(error.code, 10) ) ? parseInt(error.code, 10) : 500;

    // Don't show stack trace if it is a 404 error
    if (code === 404) {
      error.stack = null;
    }

    res.status(code);

    res.format({

      'text/html': function () {
        res.end(code);
      },

      'application/json': function () {
        let output = Object.assign({}, error.toJSON());

        if (req.app.settings.env === 'production') {
          delete output.stack;
        }

        res.json(output);
      }
    });
  });
}


module.exports = {errorHandler};

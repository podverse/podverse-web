'use strict';

const service = require('feathers-sequelize').Service;
const errors = require('feathers-errors').default;
const configuration = require('feathers-configuration');

class PlaylistService extends service {
  constructor(options) {
    super(options);
    const app = this.app;
  }

  _transformAfterRetrieval (data) {
    // Add in URL
    console.log('soooo');
    let id = data._slug || data._id;
    console.log('ok');
    data.url = `${app.get('baseURL')}/pl/${id}`;

    return data;
  }

  _transformBeforeSave (data) {

    delete data.url;

    data._slug = data._slug || uuid.v4();
    data.items = data.items || [];

    return data;
  }

  get(id, params) {
    // return new Promise((resolve, reject) => {
      super.get(id, params).then(playlist => {
        playlist = this._transformAfterRetrieval(playlist);
        resolve(playlist);
      })
      .catch(err);
    // });
  }

  // find(params [, callback]) {}
  // get(id, params [, callback]) {}
  create(data, params) {
    return asdf
    console.log('hello');
    data = this._transformBeforeSave(data);

    // Don't use whatever id is being sent.
    delete data._id;
    data.text = 'something else...';
    data.things = 'many things!';

    return super.create.apply(this, arguments)
      .then((pl => this._transformAfterRetrieval(pl)));
  }
  // update(id, data, params [, callback]) {}
  // patch(id, data, params [, callback]) {}
  // remove(id, params [, callback]) {}
  // setup(app, path) {}
}

module.exports = PlaylistService;

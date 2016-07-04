'use strict';

const service = require('feathers-sequelize');

class PlaylistService extends service {
  get(id, params) {
    return Promise.resolve({
      id,
      read: false,
      text: `Feathers is great!`,
      createdAt: new Date.getTime()
    });
  }
  // _transformAfterRetrieval (data) {
  //   // Add in URL
  //   let id = data._slug || data._id;
  //   data.url = `${config.baseURL}/pl/${id}`;
  //
  //   return data;
  // }
  //
  // _transformBeforeSave (data) {
  //
  //   delete data.url;
  //
  //   data._slug = data._slug || uuid.v4();
  //   data.items = data.items || [];
  //
  //   return data;
  // }

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

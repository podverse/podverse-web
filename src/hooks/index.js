'use strict';

// Add any common hooks you want to share across services in here.
//
// Below is an example of how a hook is written and exported. Please
// see http://docs.feathersjs.com/hooks/readme.html for more details
// on hooks.

const defaults = {};

exports.grabFirstItemFromArray = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook) {
    let data = hook.result;

    // TODO: is there a good way to do this?
    hook.result = data.data[0];

    return hook;
  };

};

/*
The goal of this code is to get the first data item from the .find() call that
happens in the PlaylistService.get().

Is there a way to query the .find() so that this hook is unnecessary?
find() returns data like ths below, but we just want the one data item...

{
  "total": 1,
  "limit": 1,
  "skip": 0,
  "data": [
    {
      "id": 1,
      "text": "title here",
      "things": null,
      "_slug": "b0cba040-28a8-45d0-806e-6c6a5288c822",
      "url": null,
      "createdAt": "2016-07-04T06:52:16.957Z",
      "updatedAt": "2016-07-04T06:52:16.957Z"
    }
  ]
}

*/


const
  Datastore = require('nedb'),
  clipsDb = new Datastore({ filename: 'clips.db', autoload:true });

module.exports = clipsDb;

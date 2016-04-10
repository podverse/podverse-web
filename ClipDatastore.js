
const
  Datastore = require('nedb'),
  clipsDb = new Datastore({ filename: 'clips.db', autoload:true, timestampData: true });

module.exports = clipsDb;

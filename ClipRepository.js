"use strict";

class ClipRepository {

  // TODO: hmm Mitch needs to understand what's up with this constructor,
  // how they work, where would this datastore parameter get passed in from
  constructor (datastore) {
    this._datastore = datastore || require('./ClipDatastore.js');
  }

  createClip (clip) {
    return new Promise ((res, rej) => {
      this._datastore.insert(clip, (e, clip) => {
        if(e) {rej(e);}
        else res(clip._id);
      });
    });
  }

  getClip (id) {

    return new Promise((res, rej) => {
      this._datastore.findOne({_id: id}, function(e, clip) {
        if(e || clip === null) {rej(e);}
        else res(clip);
      });
    });

  }

  getHomeScreenClips () {
    return new Promise((res, rej) => {
      this._datastore
        .find({})
        .sort({updatedAt: -1})
        .limit(20)
        .exec((e, clips) => {
          if(e || clips === null) {rej(e);}
          else res(clips);
        });
    });
  }

  getClipsByUserId (id) {
    return new Promise((res) => {
      this._datastore.find({clip:{userId: id}}, (err, c) => {
        res(c);
      });
    });
  }

  updateClip () {

  }

}

module.exports = ClipRepository;

var mongo = require('mongodb'),
    salt = process.env.SALT || "dev salt",
    Hashids = require('hashids'),
    hashids = new Hashids(salt),
    bcrypt = require('bcryptjs');

var db,
    BSON = mongo.BSONPure;

var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/playlistdb';

mongo.MongoClient.connect(mongoUri, function (err, database) {
  if (!err) {
    console.log("Connected to 'playlistdb' database");
    db = database;
    db.collection('hashids', {strict: true}, function(err, collection) {
      if (err) {
        populateDB();
      }
    });
  }
});

/*
exports.findAll = function(req, res) {
  db.collection('playlists', function(err, collection) {
    collection.find().toArray(function(err, items) {
      res.send(items);
    });
  });
};
*/

exports.findById = function(req, res) {
  var id = req.params.id;
  db.collection('playlists', function(err, collection) {
    collection.findOne({'hashid': id}, function(err, item) {
      if (item != null)
        res.send(item.songs);
      else
        res.send("error");
    });
  });
};

exports.addPlaylist = function(req, res) {
  var playlist = req.body;
  db.collection('hashids', function(err, collection) {
    collection.find().toArray(function(err, items) {
      collection.update({'_id': items[0]._id}, { "hashid": items[0].hashid + 1 }, {safe: true}, function(err, result) {
        if (err) {
          res.send({'error': 'An error has occurred - ' + err});
        }
      });

      playlist.hashid = hashids.encrypt(items[0].hashid);
      if (playlist.password != "") {
        playlist.password = bcrypt.hashSync(playlist.password);
      }

      db.collection('playlists', function(err, collection) {
        collection.insert(playlist, {safe: true}, function(err, result) {
          if (err) {
            res.send({'error': 'An error has occurred - ' + err});
          }
          else {
            res.send({ "url": result[0].hashid });
          }
        });
      });
    });
  });
};

exports.updatePlaylist = function(req, res) {
  var id = req.params.id;
  var playlist = req.body;
  db.collection('playlists', function(err, collection) {
    collection.findOne({'hashid': id}, function(err, item) {
      if (item != null) {
        if (item.password != undefined && item.password != "") {
          if (bcrypt.compareSync(playlist.password, item.password)) {
            collection.update({'_id': item._id}, {$set: {songs: playlist.songs}}, {safe: true}, function(err, result) {
              if (err) {
                res.send({'error': 'An error has occurred - ' + err});
              }
              else {
                res.send({ "url": item.hashid });
              }
            });
          }
          else
            res.send("error");
        }
        else
          res.send("error");
      }
      else
        res.send("error");
    });
  });
};

/*
exports.deletePlaylist = function(req, res) {
  var id = req.params.id;
  db.collection('playlists', function(err, collection) {
    collection.remove({'_id': new BSON.ObjectID(id)}, {safe: true}, function(err, result) {
      if (err) {
        res.send({'error': 'An error has occurred - ' + err});
      }
      else {
        res.send(req.body);
      }
    });
  });
};
*/

var populateDB = function() {
  var seedHashId = { hashid: 10000000000 };

  db.collection('hashids', function(err, collection) {
    collection.insert(seedHashId, {safe: true}, function(err, result) {});
  });
};

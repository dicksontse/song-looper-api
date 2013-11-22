var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('playlistdb', server);

db.open(function(err, db) {
  if (!err) {
    console.log("Connected to 'playlistdb' database");
  }
});

exports.findAll = function(req, res) {
  db.collection('playlists', function(err, collection) {
    collection.find().toArray(function(err, items) {
      res.send(items);
    });
  });
};

exports.findById = function(req, res) {
  var id = req.params.id;
  db.collection('playlists', function(err, collection) {
    collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, item) {
      res.send(item);
    });
  });
};

exports.addPlaylist = function(req, res) {
  var playlist = req.body;
  db.collection('playlists', function(err, collection) {
    collection.insert(playlist, {safe: true}, function(err, result) {
      if (err) {
        res.send({'error': 'An error has occurred - ' + err});
      }
      else {
        res.send(result[0]);
      }
    });
  });
};

/*
exports.updatePlaylist = function(req, res) {
  var id = req.params.id;
  var playlist = req.body;
  db.collection('playlists', function(err, collection) {
    collection.update({'_id': new BSON.ObjectID(id)}, playlist, {safe: true}, function(err, result) {
      if (err) {
        res.send({'error': 'An error has occurred - ' + err});
      }
      else {
        res.send(playlist);
      }
    });
  });
};

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
